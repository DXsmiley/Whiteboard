function sendPaintEvent(tool_name, action_data) {
	// console.log('sendPaintEvent', tool_name, the_points);
	socket.emit('paint',
		{
			data: {
				'tool': tool_name,
				'data': action_data,
				'board_id': whiteboard_id
			}
		}
	);
	drawCommand(tool_name, action_data);
}

function modelClose(extra_thing) {
	toolbarActivate('#toolbar_normal');
	$('#modal_pane').hide();
	$(extra_thing).hide();
}

function modelOpen(extra_thing) {
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
	e.originalEvent.preventDefault();
}

function mouseMove(e) {
	eventToolMove(0, new Point(e.pageX, e.pageY));
}

function mouseUp(e) {
	eventToolUp(0);
}

function touchDown(e) {
	mouseDown(e.touches[0]);
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

$('#modal_pane').mousedown(mouseMove);
$('#button_cancel').mousedown(modalInputCancel);
$('#button_confirm').mousedown(modalInputConfirm);
$('#modal_pane').keydown(modalKeyHandle);
// $('#modal_pane').mousemove(mouseMove);
$('#canvas2').mousedown(mouseDown);
$('#canvas2').mousemove(mouseMove);
$('#canvas2').mouseup(mouseUp);
document.addEventListener('touchstart', touchDown, false);
document.addEventListener('touchmove', touchMove, false);
document.addEventListener('touchend', mouseUp, false);
document.addEventListener('touchcancel', mouseUp, false);

// Tool buttons

function triggerToolButton(t) {
	console.log('Triggering...', t);
	// Tigger the click event
	var n = tools[t].name;
	var p = tools[t].buttonImageSelected;
	if (tools[t].onButtonClick()) {
		active_tool = tools[t];
		// Change button images
		for (i in tools) {
			var n2 = tools[i].name;
			var p2 = tools[i].buttonImage;
			document.getElementById('button_' + n2).src = '/static/images/' + p2;
		}
		document.getElementById('button_' + n).src = '/static/images/' + p;
	}
}

$(document).ready( function() {
	for (i in tools) {
		// Clojures because javascript is strange...
		console.log(i, 'is a tool');
		function clojure() {
			var name = tools[i].name;
			$('#button_' + name).click(function(e) {triggerToolButton(name);});
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
}

$(document).ready( function() {
	for (i in colours) {
		console.log(i, 'is a colour');
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

// Data transfer

$(document).ready(function() {

	triggerToolButton('pencil');

	console.log('Board ID:', whiteboard_id);
	
	socket = io.connect('http://' + document.domain + ':' + location.port + '/');
	socket.emit('full image', {data:{'board_id': whiteboard_id}});

	socket.on('paint', function(msg) {
		// console.log('paint', msg);
		if (msg.data.board_id == whiteboard_id) {
			actions = msg.data.actions;
			for (i in actions) {
				// console.log(actions[i].tool, actions[i].points);
				drawCommand(actions[i].tool, actions[i].data);
			}
		}
	});

});