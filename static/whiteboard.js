function TextHead(colour) {
	this.colour = colour;
	this.point = new Point(0, 0);
	$('.text_display').show();
	$('#input_focal_pane').show();
	$('#text_input_text').text('Enter Text');
}

jQuery.fn.selectText = function() {
	var range, selection;
	return this.each(function() {
		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(this);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(this);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	});
};

TextHead.prototype.onMove = function(a) {
	// Move text and display
	var new_point = new Point(a.x, a.y);
	this.point = new_point;
	window.setTimeout(function () {
		var e = $('#text_input_text');
		e.css('left', new_point.x);
		e.css('top', new_point.y - 8);
		e.selectText();
		e.focus();
	}, 10);
}

TextHead.prototype.onRelease = function() {
	// do nothing...
}

TextHead.prototype.onModelConfirm = function() {
	console.log('Committing text paint...');
	sendPaintEvent('text', {
		colour: this.colour,
		position: this.point,
		text: $('#text_input_text').text(),
	});
	this.onModelCancel();
}

TextHead.prototype.onModelCancel = function() {
	$('.text_display').hide();
	$('#input_focal_pane').hide();
	toolbarActivate('#toolbar_normal');
}

$(document).ready(function() {
	$('#text_input_text').keydown(modelKeyHandle);
})

makeTool({
	name: 'text',
	buttonImage: 'text.png',
	buttonImageSelected: 'text_select.png',
	onButtonClick: function() {
		console.log('Selected Text');
		return true;
	},
	makeToolHead: function() {
		toolbarActivate("#toolbar_confirmcancel");
		return new TextHead(global_colour);
	},
	drawFull: function(data) {
		console.log('tool_text.drawFull', data);
		var pos = data.position;
		var text = data.text;
		var colour = data.colour;
		var font = '30px Helvetica';
		drawText(pos, text, colour, font, context_picture);
	}
});

makeTool({
	name: 'image',
	buttonImage: 'col_white.png',
	buttonImageSelected: 'col_s_white.png',
	onButtonClick: function() {
		console.log('Image plox');
		var url = window.prompt('Enter image url', '');
		if (url) {
			var data = {
				'url': url,
				'position': new Point(150, 150)
			};
			sendPaintEvent('image', data);
		}
		return false;
	},
	drawFull: function(data) {
		base_image = new Image();
		base_image.src = data.url;
		base_image.onload = function(){
			context_picture.drawImage(base_image, data.position.x, data.position.y);
		}
	},
	makeToolHead: function() {
		return null;
	}
});

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

// Perform events

function eventToolDown(n, p) {
	tool_heads[n] = active_tool.makeToolHead();
	tool_heads[n].onMove(p);
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

function modelInputConfirm() {
	for (i in tool_heads) {
		if (tool_heads[i] != null) {
			tool_heads[i].onModelConfirm();
		}
	}
}

function modelInputCancel() {
	for (i in tool_heads) {
		if (tool_heads[i] != null) {
			tool_heads[i].onModelCancel();
		}
	}
}

function modelKeyHandle(event) {
	if (event.keyCode == 13 && !event.shiftKey) modelInputConfirm();
	if (event.keyCode == 27) modelInputCancel();
}

$('#input_focal_pane').mousedown(mouseMove);
$('#button_cancel').mousedown(modelInputCancel);
$('#button_confirm').mousedown(modelInputConfirm);
$('#input_focal_pane').keydown(modelKeyHandle);
// $('#input_focal_pane').mousemove(mouseMove);
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
			console.log(i);
			document.getElementById('button_' + n2).src = '/static/images/' + p2;
			console.log('done');
		}
		console.log(n);
		document.getElementById('button_' + n).src = '/static/images/' + p;
		console.log('done');
	}
}

$(document).ready( function() {
	for (i in tools) {
		// Clojures because javascript is strange...
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