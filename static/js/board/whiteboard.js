function Whiteboard() {
	this.whiteboard_id = 'unknown';
	this.socket = undefined;
	this.tool_heads = [null, null, null, null, null]; // support up to five fingers! not.
	this.context_picture = document.getElementById('canvas1').getContext('2d'); // bottom layer
	this.context_preview = document.getElementById('canvas2').getContext('2d'); // top layer
	this.active_tool = null;
	this.colours = {
		black: '#2a2a2a',
		blue: '#007fee',
		red: '#ee7f00'
	};
	this.global_colour = this.colours['blue'];
	this.tools = {};
	this.paint_blobs_mine = [];
	this.paint_blobs_undone = {};
	this.paint_blobs_all = [];
	this.pan_x = 0;
	this.pan_y = 0;
	this.panning = false;
	this.last_mouse_x = 0;
	this.last_mouse_y = 0;
	this.current_modal = null;
	this.keyboard_shortcuts = {};
};

Whiteboard.prototype.getKey = function(key) {
	key = Cookies.get('key_' + this.whiteboard_id);
	if (!key) key = '';
	return key;
};

Whiteboard.prototype.makeTool = function(tool) {
	this.tools[tool.name] = tool;
};

Whiteboard.prototype.setId = function(wid) {
	this.whiteboard_id = wid;
};

Whiteboard.prototype.sendUndoEvent = function(action_id) {
	this.paint_blobs_undone[action_id] = action_id;
	this.drawEverything();
	this.socket.emit('undo',
		{
			'action_id': action_id,
			'board_id': this.whiteboard_id,
			'key': this.getKey()
		}
	);
};

Whiteboard.prototype.sendUnlockEvent = function(target) {
	this.socket.emit('unlock',
		{
			'board_id': this.whiteboard_id,
			'level': 'open',
			'key': this.getKey()
		}
	);
}

Whiteboard.prototype.sendPaintEvent = function(tool_name, action_data, extend) {
	// console.log('sendPaintEvent', tool_name, the_points);
	var action_id = Math.random();
	if (extend === true) {
		action_id = this.paint_blobs_mine.pop();
	}
	this.socket.emit('paint',
		{
			'action_id': action_id,
			'tool': tool_name,
			'data': action_data,
			'board_id': this.whiteboard_id,
			'key': this.getKey()
		}
	);
	this.paint_blobs_mine.push(action_id);
	this.drawCommand(tool_name, action_data);
};

Whiteboard.prototype.modalClose = function(extra_thing) {
	var the_whiteboard = this;
	this.toolbarActivate('#toolbar_normal');
	$('#modal_pane').css('opacity', 0);
	$('.modal_centered').css('opacity', 0);
	$(extra_thing).css('opacity', 0);
	setTimeout(function() {
		if ($('#modal_pane').css('opacity') < 0.5) {
			$('#modal_pane').hide();
			$('.modal_centered').hide();
			the_whiteboard.current_modal = null;
		}
		$(extra_thing).hide();
	}, 500);
};

Whiteboard.prototype.modalOpen = function() {
	// Convert 'arguments' into an actual array.
	var the_args = Array.prototype.slice.call(arguments);
	this.current_modal = the_args[0];
	the_args.push('#modal_pane');
	this.toolbarActivate();
	for (var i in the_args) {
		$(the_args[i]).css('display', 'block');
	}
	setTimeout(function() {
		for (var i in the_args) {
			$(the_args[i]).css('opacity', 1);
		}
	}, 1);
};

Whiteboard.prototype.setToolHead = function(head) {
	this.tool_heads[0] = head;
}

// Perform events

Whiteboard.prototype.eventToolDown = function(n, p, b) {
	if (this.active_tool) {
		this.tool_heads[n] = this.active_tool.makeToolHead(b);
		if (this.tool_heads[n] && this.tool_heads[n].onMove != undefined) {
			this.tool_heads[n].onMove(p);
		}
	}
}

Whiteboard.prototype.eventToolMove = function(n, p) {
	if (this.tool_heads[n] && this.tool_heads[n].onMove != undefined) {
		this.tool_heads[n].onMove(p);
	}
};

Whiteboard.prototype.eventToolUp = function(n) {
	if (this.tool_heads[n]) {
		if (this.tool_heads[n].onRelease != undefined) {
			this.tool_heads[n].onRelease();
		}
		this.tool_heads[n] = null;
	}
};

// Pan and Zoom

Whiteboard.prototype.panCanvas = function(x, y) {
	this.pan_x += x;
	this.pan_y += y;
	$('#canvas_wrapper').css('left', this.pan_x + 'px');
	$('#canvas_wrapper').css('top', this.pan_y + 'px');
	// make sure the display updates
	if (!isMobile()) {
		$('#canvas_wrapper').toggle();
		$('#canvas_wrapper').toggle();
	}
};

// Interperet events

Whiteboard.prototype.mouseDown = function(event) {
	if (event.which == 3) {
		this.last_mouse_x = event.pageX;
		this.last_mouse_y = event.pageY;
		this.panning = true;
	} else {
		var touchpoint = new Point(event.pageX - this.pan_x, event.pageY - this.pan_y);
		this.eventToolDown(0, touchpoint, event.which);
	}
	if (event.preventDefault) event.preventDefault();
};

Whiteboard.prototype.mouseMove = function(event) {
	if (event.buttons == 0) {
		this.panning = false;
	}
	if (this.panning) {
		var dx = event.pageX - this.last_mouse_x;
		var dy = event.pageY - this.last_mouse_y;
		this.last_mouse_x = event.pageX;
		this.last_mouse_y = event.pageY;
		this.panCanvas(dx, dy);
	} else {
		this.eventToolMove(0, new Point(event.pageX - this.pan_x, event.pageY - this.pan_y));
	}
	if (event.preventDefault) event.preventDefault();
};

Whiteboard.prototype.mouseUp = function(event) {
	this.eventToolUp(0);
	this.panning = false;
	event.preventDefault();
};

function touchCentre(touches) {
	var sx = 0;
	var sy = 0;
	for (var i = 0; i < touches.length; ++i) {
		sx += touches[i].pageX;
		sy += touches[i].pageY;
	}
	sx /= touches.length;
	sy /= touches.length;
	return {x: sx, y: sy};
}

Whiteboard.prototype.touchDown = function(event) {
	if (event.touches.length == 1) {
		this.eventToolDown(0, new Point(event.touches[0].pageX - this.pan_x, event.touches[0].pageY - this.pan_y));
	}
	if (event.touches.length == 2) {
		var c = touchCentre(event.touches);
		this.last_mouse_x = c.x;
		this.last_mouse_y = c.y;
		this.panning = true;
	}
	event.preventDefault();
};

Whiteboard.prototype.touchMove = function(event) {
	if (this.panning) {
		var c = touchCentre(event.touches);
		var dx = c.x - this.last_mouse_x;
		var dy = c.y - this.last_mouse_y;
		this.last_mouse_x = c.x;
		this.last_mouse_y = c.y;
		this.panCanvas(dx, dy);
	} else {
		if (event.touches.length > 1) {
			this.eventToolUp(0);
			var c = touchCentre(event.touches);
			this.last_mouse_x = c.x;
			this.last_mouse_y = c.y;
			this.panning = true;
		} else {
			this.eventToolMove(0, new Point(event.touches[0].pageX - this.pan_x, event.touches[0].pageY - this.pan_y));
		}
	}
	event.preventDefault();
};

Whiteboard.prototype.drawCommand = function(the_tool, the_data) {
	if (the_tool in this.tools) {
		this.tools[the_tool].drawFull(the_data);
	}
};

Whiteboard.prototype.modalInputConfirm = function() {
	for (var i in this.tool_heads) {
		if (this.tool_heads[i] != null) {
			if (!this.tool_heads[i].onModalConfirm()) {
				this.tool_heads[i] = null;
			}
		}
	}
};

Whiteboard.prototype.modalInputCancel = function() {
	for (var i in this.tool_heads) {
		if (this.tool_heads[i] != null) {
			if (!this.tool_heads[i].onModalCancel()) {
				this.tool_heads[i] = null;
			}
		}
	}
};

Whiteboard.prototype.handleKeypress = function(event) {
	if (this.current_modal == null) {
		// trigger keyboard shortcut
		var key_tool = this.keyboard_shortcuts[event.key];
		if (key_tool != undefined) {
			this.triggerToolButton(key_tool, false);
		}
	} else {
		if (event.key == "Enter") this.modalInputConfirm();
		if (event.key == "Escape") this.modalInputCancel();
	}
};

// Tool buttons

Whiteboard.prototype.triggerToolButton = function(t, dbl) {
	console.log('Tool:', t);
	// Tigger the click event
	var click_result = false;
	var triggered = false;
	if (dbl) {
		if (this.tools[t].onDoubleClick !== undefined) {
			click_result = this.tools[t].onDoubleClick();
			triggered = true;
		}
	} else {
		click_result = this.tools[t].onButtonClick();
		triggered = true;
	}
	if (triggered) {
		if (click_result === true) {
			// Button was selected. This is good.
			this.active_tool = this.tools[t];
			// Change button images
			for (var i in this.tools) {
				var t_name = this.tools[i].name;
				var t_image = this.tools[i].buttonImage;
				var bt_elem = $('#button_' + t_name);
				if (bt_elem) {
					bt_elem.removeClass('toolbar_button_selected');
				}
			}
			var t_image = this.tools[t].buttonImageSelected;
			var btn = $('#button_' + t);
			btn.addClass('toolbar_button_selected');
		} else if (click_result === false) {
			// The button did an action, we don't need to do anything.
		} else {
			// The button produced a toolhead.
			// Probably means the modal pane was opened, for clear confirmation or something.
			this.tool_heads[0] = click_result;
		}
	}
};

Whiteboard.prototype.triggerColourButton = function(col) {
	console.log('Colour: ', col, this.colours[col]);
	this.global_colour = this.colours[col];
	for (var i in this.colours) {
		$("#colour_" + i).removeClass('toolbar_button_selected');
	}
	$('#colour_' + col).addClass('toolbar_button_selected');
	if (this.active_tool && this.active_tool.name == 'eraser') {
		this.triggerToolButton('pencil');
	}
};

Whiteboard.prototype.sockHandlePaint = function(msg) {
	if (msg.board_id == this.whiteboard_id) {
		actions = msg.actions;
		for (var i in actions) {
			this.drawCommand(actions[i].tool, actions[i].data);
			this.paint_blobs_all.push(actions[i]);
		}
	}
};

Whiteboard.prototype.sockHandleUndo = function(msg) {
	if (msg.board_id == this.whiteboard_id) {
		aid = msg.action_id;
		console.log('Received Undo', aid);
		if (this.paint_blobs_undone[aid] === undefined) {
			this.paint_blobs_undone[aid] = aid;
			this.drawEverything();
		}
	}
};

Whiteboard.prototype.toolbarActivate = function() {
	var toolbars = ['#toolbar_normal', '#toolbar_confirm', '#toolbar_cancel', '#toolbar_image'];
	for (var i in toolbars) {
		$(toolbars[i]).css('left', '-80px');
	}
	for (var i in arguments) {
		$(arguments[i]).css('left', '0px');
	}
	if (arguments.length == 0) {
		$('#toolbar_wrapper').css('left', '-80px');
	} else {
		$('#toolbar_wrapper').css('left', '0px');
	}
	$('#toolbar_wrapper').show();
}

Whiteboard.prototype.drawEverything = function() {
	console.log('Drawing everything!');
	drawClearSolid(this.context_picture);
	var last_clear = this.paint_blobs_all.length - 1;
	while (last_clear >= 0) {
		var aid = this.paint_blobs_all[last_clear]['action_id'];
		if (this.paint_blobs_undone[aid] === undefined) {
			if (this.paint_blobs_all[last_clear].tool == 'clear') break;
		}
		--last_clear;
	}
	for (var i = last_clear + 1; i < this.paint_blobs_all.length; ++i) {
		var aid = this.paint_blobs_all[i]['action_id'];
		if (this.paint_blobs_undone[aid] === undefined) {
			this.drawCommand(this.paint_blobs_all[i].tool, this.paint_blobs_all[i].data);
		}
	}
};

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

Whiteboard.prototype.startup = function() {

	// Workaround for javascript clojure funkyness.
	var the_whiteboard = this;

	for (var i in this.colours) {
		(function() {
			var x = i;
			$('#colour_' + x).mousedown(function(event) {the_whiteboard.triggerColourButton(x);});
		})();
	}

	for (var i in this.tools) {
		(function() {
			var name = the_whiteboard.tools[i].name;
			var desktop_only = the_whiteboard.tools[i]['desktopOnly'];
			if (desktop_only === true && isMobile()) {
				// disable the stuff
				console.log('Disabling tool', i);
				$('#button_' + name).hide();
				$('#button_' + name).next().hide();
			} else {
				$('#button_' + name).mousedown(function(event) {the_whiteboard.triggerToolButton(name, false);});
				var shortcut_key = the_whiteboard.tools[i].shortcut_key;
				if (shortcut_key !== undefined) {
					the_whiteboard.keyboard_shortcuts[shortcut_key] = name;
				}
			}
		})();
	}

	console.log('Board ID:', this.whiteboard_id);

	// this.socket = io.connect('https://' + document.domain + ':' + location.port + '/', {'reconnection': true, 'reconnection delay': 500});
	this.socket = io.connect('https://' + document.domain + ':' + location.port + '/');

	this.socket.on('paint', function(msg) {
		the_whiteboard.sockHandlePaint(msg);
	});

	this.socket.on('undo', function(msg) {
		the_whiteboard.sockHandleUndo(msg);
	});

	this.socket.on('refresh', function(msg) {
		location.reload(true);
	});

	this.socket.on('connect', function() {
		console.log('Connected to server.');
		var func = () => {$('#status_message').css('top', -200);};
		window.setTimeout(func, 500);
	});

	this.socket.on('disconnect', function() {
		console.error('Disconnected from the server!');
		$('#status_message_text').html('&#9888; Disconnected from server');
		$('#status_message').css('top', 20);
	});

	this.socket.on('reconnect', function() {
		console.log('Reconnected to server!');
		location.reload(true);
	});

	this.socket.emit('full image',
		{
			'board_id': this.whiteboard_id,
			'key': this.getKey()
		}
	);

};

Whiteboard.prototype.shutdown = function() {
	this.socket.close();
};

// The unavoidable(?) globals

var whiteboard = new Whiteboard();

$(window).on('beforeunload', function(){
	whiteboard.shutdown();
});

$(document).ready(function() {

	$('#modal_pane').mousedown(function(event) {whiteboard.mouseMove(event);});
	$('img.button_cancel').click(function(event) {whiteboard.modalInputCancel(event);});
	$('img.button_confirm').click(function(event) {whiteboard.modalInputConfirm(event);});
	// $('#modal_pane').mousemove(function(event) {whiteboard.mouseMove(event);});
	$(document).keydown(function(event) {whiteboard.handleKeypress(event);});
	$('#canvas2').mousedown(function(event) {whiteboard.mouseDown(event);});
	$('#canvas2').mousemove(function(event) {whiteboard.mouseMove(event);});
	$('#canvas2').mouseup(function(event) {whiteboard.mouseUp(event);});
	var can2 = document.getElementById('canvas2');
	can2.addEventListener('touchstart', function(event) {whiteboard.touchDown(event);}, false);
	can2.addEventListener('touchmove', function(event) {whiteboard.touchMove(event);}, false);
	can2.addEventListener('touchend', function(event) {whiteboard.mouseUp(event);}, false);
	can2.addEventListener('touchcancel', function(event) {whiteboard.mouseUp(event);}, false);

	var toolbar_y = 0;

	function scrollToolbar(event) {
		var space = $('#toolbar_wrapper').height() - $('#toolbar_footer').height();
		var height = $('#toolbar_scrollable').height() - space;
		toolbar_y += event.deltaY * 16;
		toolbar_y = Math.min(toolbar_y, height); // size of toolbar times
		toolbar_y = Math.max(toolbar_y, 0);
		$('#toolbar_scrollable').css('top', (-toolbar_y) + 'px');
	}

	document.getElementById("toolbar_wrapper").addEventListener('wheel', scrollToolbar);

	whiteboard.startup();

});
