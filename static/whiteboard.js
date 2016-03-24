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
			'data': {
				'action_id': action_id,
				'board_id': this.whiteboard_id,
				'key': this.getKey()
			}
		}
	);
};

Whiteboard.prototype.sendUnlockEvent = function(target) {
	this.socket.emit('unlock',
		{
			'data': {
				'board_id': this.whiteboard_id,
				'level': 'open',
				'key': this.getKey()
			}
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
			'data': {
				'action_id': action_id,
				'tool': tool_name,
				'data': action_data,
				'board_id': this.whiteboard_id,
				'key': this.getKey()
			}
		}
	);
	this.paint_blobs_mine.push(action_id);
	this.drawCommand(tool_name, action_data);
};

Whiteboard.prototype.modalClose = function(extra_thing) {
	this.toolbarActivate('#toolbar_normal');
	$('#modal_pane').hide();
	$(extra_thing).hide();
};

Whiteboard.prototype.modalOpen = function(extra_thing) {
	this.toolbarActivate('#toolbar_confirmcancel');
	$('#modal_pane').show();
	$(extra_thing).show();
};

// Perform events

Whiteboard.prototype.eventToolDown = function(n, p) {
	if (this.active_tool) {
		this.tool_heads[n] = this.active_tool.makeToolHead();
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
	$('#canvas_wrapper').toggle();
	$('#canvas_wrapper').toggle();
};

// Interperet events

Whiteboard.prototype.mouseDown = function(event) {
	if (event.which == 1) {
		this.eventToolDown(0, new Point(event.pageX - this.pan_x, event.pageY - this.pan_y));
	}
	if (event.which == 3) {
		this.last_mouse_x = event.pageX;
		this.last_mouse_y = event.pageY;
		this.panning = true;
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

Whiteboard.prototype.modalKeyHandle = function(event) {
	if (event.keyCode == 13 && !event.shiftKey) this.modalInputConfirm();
	if (event.keyCode == 27) this.modalInputCancel();
};

Whiteboard.prototype.canvasDoubleClick = function() {
	if (this.active_tool) {
		console.log('canvasDoubleClick', this.active_tool);
		this.triggerToolButton(this.active_tool.name, true);
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
	if (msg.data.board_id == this.whiteboard_id) {
		actions = msg.data.actions;
		for (var i in actions) {
			this.drawCommand(actions[i].tool, actions[i].data);
			this.paint_blobs_all.push(actions[i]);
		}
	}
};

Whiteboard.prototype.sockHandleUndo = function(msg) {
	if (msg.data.board_id == this.whiteboard_id) {
		aid = msg.data.action_id;
		console.log('Received Undo', aid);
		if (this.paint_blobs_undone[aid] === undefined) {
			this.paint_blobs_undone[aid] = aid;
			this.drawEverything();
		}
	}
};

Whiteboard.prototype.toolbarActivate = function (to_activate) {
	var toolbars = ['#toolbar_normal', '#toolbar_confirmcancel', '#toolbar_unlock'];
	for (var i in toolbars) {
		$(toolbars[i]).css('display', 'none');
	}
	$(to_activate).css('display', 'block');
}

Whiteboard.prototype.drawEverything = function() {
	console.log('Drawing everything!');
	drawClear(this.context_picture);
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
			if (desktop_only === true && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				// disable the stuff
				console.log('Disabling tool', i);
				$('#button_' + name).hide();
				$('#button_' + name).next().hide();
			} else {
				$('#button_' + name).mousedown(function(event) {the_whiteboard.triggerToolButton(name, false);});
				$('#button_' + name).dblclick(function(event) {the_whiteboard.triggerToolButton(name, true);})
			}
		})();
	}

	console.log('Board ID:', this.whiteboard_id);

	this.socket = io.connect('http://' + document.domain + ':' + location.port + '/');

	this.socket.on('paint', function(msg) {
		the_whiteboard.sockHandlePaint(msg);
	});

	this.socket.on('undo', function(msg) {
		the_whiteboard.sockHandleUndo(msg);
	});

	this.socket.on('refresh', function(msg) {
		location.reload(true);
	});

	this.socket.emit('full image',
		{
			data:
				{
					'board_id': this.whiteboard_id,
					'key': this.getKey()
				}
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
	$('#button_cancel').click(function(event) {whiteboard.modalInputCancel(event);});
	$('#button_confirm').click(function(event) {whiteboard.modalInputConfirm(event);});
	$('#modal_pane').keydown(function(event) {whiteboard.modalKeyHandle(event);});
	// $('#modal_pane').mousemove(function(event) {whiteboard.mouseMove(event);});
	$('#canvas2').mousedown(function(event) {whiteboard.mouseDown(event);});
	$('#canvas2').mousemove(function(event) {whiteboard.mouseMove(event);});
	$('#canvas2').mouseup(function(event) {whiteboard.mouseUp(event);});
	$('#canvas2').dblclick(function(event) {whiteboard.canvasDoubleClick(event);});
	document.getElementById('canvas2').addEventListener('touchstart', function(event) {whiteboard.touchDown(event);}, false);
	document.getElementById('canvas2').addEventListener('touchmove', function(event) {whiteboard.touchMove(event);}, false);
	document.getElementById('canvas2').addEventListener('touchend', function(event) {whiteboard.mouseUp(event);}, false);
	document.getElementById('canvas2').addEventListener('touchcancel', function(event) {whiteboard.mouseUp(event);}, false);

	whiteboard.startup();

});