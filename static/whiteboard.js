function sendUndoEvent(action_id) {
	socket.emit('undo',
		{
			'data': {
				'action_id': action_id,
				'board_id': whiteboard_id
			}
		}
	);
	paint_blobs_undone[action_id] = action_id;
}

function sendPaintEvent(tool_name, action_data) {
	// console.log('sendPaintEvent', tool_name, the_points);
	var action_id = Math.random();
	socket.emit('paint',
		{
			'data': {
				'action_id': action_id,
				'tool': tool_name,
				'data': action_data,
				'board_id': whiteboard_id
			}
		}
	);
	paint_blobs_mine.push(action_id);
	drawCommand(tool_name, action_data);
}

function modalClose(extra_thing) {
	toolbarActivate('#toolbar_normal');
	$('#modal_pane').hide();
	$(extra_thing).hide();
}

function modalOpen(extra_thing) {
	toolbarActivate('#toolbar_confirmcancel');
	$('#modal_pane').show();
	$(extra_thing).show();
}

// Perform events

function eventToolDown(n, p) {
	tool_heads[n] = active_tool.makeToolHead();
	if (tool_heads[n]) {
		tool_heads[n].onMove(p);
	}
}

function eventToolMove(n, p) {
	if (tool_heads[n]) {
		tool_heads[n].onMove(p);
	}
}

function eventToolUp(n) {
	if (tool_heads[n]) {
		tool_heads[n].onRelease();
		tool_heads[n] = null;
	}
}

// Interperet events

function mouseDown(e) {
	eventToolDown(0, new Point(e.pageX, e.pageY));
	e.preventDefault();
}

function mouseMove(e) {
	eventToolMove(0, new Point(e.pageX, e.pageY));
	// e.preventDefault();
}

function mouseUp(e) {
	eventToolUp(0);
	// e.preventDefault();
}

function touchDown(e) {
	mouseDown(e.touches[0]);
	e.preventDefault();
}

function touchMove(e) {
	mouseMove(e.touches[0]);
	e.preventDefault();
}

function drawCommand(the_tool, the_data) {
	if (the_tool in tools) {
		tools[the_tool].drawFull(the_data);
	}
}

function modalInputConfirm() {
	for (i in tool_heads) {
		if (tool_heads[i] != null) {
			tool_heads[i].onModalConfirm();
		}
	}
}

function modalInputCancel() {
	for (i in tool_heads) {
		if (tool_heads[i] != null) {
			tool_heads[i].onModalCancel();
		}
	}
}

function modalKeyHandle(event) {
	if (event.keyCode == 13 && !event.shiftKey) modalInputConfirm();
	if (event.keyCode == 27) modalInputCancel();
}

// Smartboard Integration

var use_full_integration = false;

if (use_full_integration) {
	SB.wantsSDKEvents = true;
	SB.enableDebugBanners = true;
	window.SD.onPoint = function(event) {
		console.log('Smartboard event:', event)
	}
} else {
	SB.wantsTouches = false;
	SB.wantsDDKEvents = false;
}

// Input events

$('#modal_pane').mousedown(mouseMove);
$('#button_cancel').click(modalInputCancel);
$('#button_confirm').click(modalInputConfirm);
$('#modal_pane').keydown(modalKeyHandle);
// $('#modal_pane').mousemove(mouseMove);
$('#canvas2').mousedown(mouseDown);
$('#canvas2').mousemove(mouseMove);
$('#canvas2').mouseup(mouseUp);
// document.addEventListener('touchstart', touchDown, false);
// document.addEventListener('touchmove', touchMove, false);
// document.addEventListener('touchend', mouseUp, false);
// document.addEventListener('touchcancel', mouseUp, false);
document.getElementById('canvas2').addEventListener('touchstart', touchDown, false);
document.getElementById('canvas2').addEventListener('touchmove', touchMove, false);
document.getElementById('canvas2').addEventListener('touchend', mouseUp, false);
document.getElementById('canvas2').addEventListener('touchcancel', mouseUp, false);

// Tool buttons

function triggerToolButton(t, dbl) {
	console.log('Tool:', t);
	// Tigger the click event
	var click_result = false;
	if (dbl) {
		click_result = tools[t].onDoubleClick();
	} else {
		click_result = tools[t].onButtonClick();
	}
	var p = tools[t].buttonImageSelected;
	if (click_result === true) {
		// Button was selected. This is good.
		active_tool = tools[t];
		// Change button images
		for (i in tools) {
			var n2 = tools[i].name;
			var p2 = tools[i].buttonImage;
			document.getElementById('button_' + n2).src = '/static/images/' + p2;
		}
		document.getElementById('button_' + t).src = '/static/images/' + p;
	} else if (click_result === false) {
		// The button did an action, we don't need to do anything.
	} else {
		// The button produced a toolhead.
		// Probably means the modal pane was opened, for clear confirmation or something.
		tool_heads[0] = click_result;
	}
}

$(document).ready( function() {
	for (i in tools) {
		// Clojures because javascript is strange...
		// console.log(i, 'is a tool');
		function clojure() {
			var name = tools[i].name;
			var desktop_only = tools[i]['desktopOnly'];
			if (desktop_only === true && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				// disable the stuff
				console.log('Disabling tool', i);
				$('#button_' + name).hide();
				$('#button_' + name).next().hide();
			} else {
				$('#button_' + name).click(function(e) {triggerToolButton(name, false);});
				$('#button_' + name).dblclick(function(e) {triggerToolButton(name, true);})
			}
		}
		clojure();
	}
});

// Colours

var colours = {
	black: '#444444',
	blue: '#484fc0',
	red: '#df4b26'
};

global_colour = colours['black'];

function triggerColourButton(col) {
	console.log('Colour: ', col, colours[col]);
	global_colour = colours[col];
	for (i in colours) {
		$("#colour_" + i).attr('src', '/static/images/col_' + i + '.png');
	}
	$('#colour_' + col).attr('src', '/static/images/col_s_' + col + '.png');
	if (active_tool.name == 'eraser') {
		triggerToolButton('pencil');
	}
}

$(document).ready( function() {
	for (i in colours) {
		// console.log(i, 'is a colour');
		function clojure() {
			var x = i;
			$('#colour_' + x).click(function(e) {triggerColourButton(x);});
		}
		clojure();
	}
});

// Toolbars

function toolbarActivate(to_activate) {
	var toolbars = ['#toolbar_normal', '#toolbar_confirmcancel'];
	for (i in toolbars) {
		$(toolbars[i]).css('display', 'none');
	}
	$(to_activate).css('display', 'block');
}

toolbarActivate('#toolbar_normal');

function drawEverything() {
	console.log('Drawing everything!');
	drawClear(context_picture);
	for (i in paint_blobs_all) {
		if (! (paint_blobs_all[i]['action_id'] in paint_blobs_undone)) {
			drawCommand(paint_blobs_all[i].tool, paint_blobs_all[i].data);
		}
	}
}

// Data transfer

$(document).ready(function() {

	triggerToolButton('pencil');
	triggerColourButton('blue');

	console.log('Board ID:', whiteboard_id);

	socket = io.connect('http://' + document.domain + ':' + location.port + '/');

	socket.on('paint', function(msg) {
		// console.log('paint', msg);
		if (msg.data.board_id == whiteboard_id) {
			actions = msg.data.actions;
			for (i in actions) {
				// console.log(actions[i].tool, actions[i].points);
				drawCommand(actions[i].tool, actions[i].data);
				paint_blobs_all.push(actions[i]);
			}
		}
	});

	socket.on('undo', function(msg) {
		if (msg.data.board_id == whiteboard_id) {
			aid = msg.data.action_id;
			console.log('Received Undo', aid);
			paint_blobs_undone[aid] = aid;
			drawEverything();
		}
	});

	socket.emit('full image', {data:{'board_id': whiteboard_id}})

	// window.setTimeout(
	// 	function() {socket.emit('full image', {data:{'board_id': whiteboard_id}});},
	// 	10
	// );

});

$(window).on('beforeunload', function(){
	socket.close();
});