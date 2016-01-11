var whiteboard_id = 'unknown';
var socket = undefined;
var tool_heads = [null, null, null, null, null]; // support up to five fingers! not.
var tools_by_name = {};
var context_picture = document.getElementById('canvas1').getContext('2d'); // bottom layer
var context_preview = document.getElementById('canvas2').getContext('2d'); // top layer
var active_tool = null;

function setWhiteboardId(wid) {
	whiteboard_id = wid;
}

// Functions for drawing things on canvases

function drawClear(context) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawSegment(start, end, context, colour, thickness) {
	context.lineJoin = "round";
	context.strokeStyle = colour;
	context.lineWidth = thickness;
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(end.x, end.y);
	context.closePath();
	context.stroke();
}

function drawLine(points, context, colour, thickness) {
	if (points.length > 1) {
		for (var i = 1; i < points.length; i++) {
			drawSegment(points[i - 1], points[i], context, colour, thickness);
		}
	}
}

function drawLineTimed(points, context, colour, thickness, interval) {
	// This seems extremely inefficient...
	if (points.length > 1) {
		var i = 1;
		function func() {
			if (i < points.length) {
				drawSegment(points[i - 1], points[i], context, colour, thickness);
				i += 1;
				window.setTimeout(func, interval);
			}
		}
		func();
	}
}

function drawText(position, text, colour, font, context) {
	context.textBaseline = 'top';
	context.font = font;
	context.fillStyle = colour;
	context.fillText(text, position.x, position.y);
}

// A tool head for drawing like a pencil. This can also be used to function as an eraser.

function PencilHead(tool_name, colour, thickness) {
	this.tool_name = tool_name;
	this.points = Array();
	this.colour = colour;
	this.thickness = thickness;
	this.distance = 0;
}

PencilHead.prototype.pushData = function() {
	if (this.points.length > 1) {
		var last_point = this.points[this.points.length - 1];
		sendPaintEvent(this.tool_name, cleanupLine(this.points));
		this.points = [last_point];
	}
}

PencilHead.prototype.onMove = function(new_point) {
	if (new_point) {
		this.points.push(new_point);
		var l = this.points.length;
		if (l > 1) {
			drawSegment(this.points[l - 2], new_point, context_preview, this.colour, this.thickness);
			this.distance += distance(this.points[l - 2], new_point);
		}
		if (this.distance > 2000 && l > 200) {
			this.pushData()
			this.distance = 0;
		}
	}
}

PencilHead.prototype.onRelease = function() {
	this.pushData();
	drawClear(context_preview);
}

var tool_pencil = {
	name: 'pencil',
	buttonImage: 'pencil.png',
	buttonImageSelected: 'pencil_select.png',
	onButtonClick: function() {
		console.log('Selected Pencil');
		return true;
	},
	makeToolHead: function() {
		return new PencilHead('pencil', '#df4b26', 2);
	},
	drawFull: function(points) {
		drawLine(points, context_picture, '#484fc0', 2);
	}
};

var tool_eraser = {
	name: 'eraser',
	buttonImage: 'eraser.png',
	buttonImageSelected: 'eraser_select.png',
	onButtonClick: function() {
		console.log('Selected Eraser');
		return true;
	},
	makeToolHead: function() {
		return new PencilHead('eraser', '#dddddd', 30);
	},
	drawFull: function(points) {
		drawLine(points, context_picture, '#ffffff', 30);
	}
};

var tool_clear = {
	name: 'clear',
	buttonImage: 'clear.png',
	onButtonClick: function() {
		sendPaintEvent('clear', []);
		// This is just a button.
		return false;
	},
	drawFull: function(data) {
		drawClear(context_picture);
	}
};

function TextHead() {
	this.text = 'Type here!';
	$('#text_input_pane').show();
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
	var point = new Point(a.x, a.y);
	window.setTimeout(function () {
		var e = $('#text_input_text');
		e.css('left', point.x);
		e.css('top', point.y);
		e.selectText();
		e.focus();
	}, 10);
	// Setup callbacks
	function textInputKeyHandle(event) {
		var commit = (event.keyCode == 13 && !event.shiftKey);
		if (commit) {
			console.log('Committing text paint...');
			sendPaintEvent('text', {
				position: point,
				text: $('#text_input_text').text(),
			});
		}
		if (commit || event.keyCode == 27) {
			$('#text_input_pane').hide();
		}
	}
	$('#text_input_text').off('keydown');
	$('#text_input_pane').off('keydown');
	$('#text_input_text').keydown(textInputKeyHandle);
	$('#text_input_pane').keydown(textInputKeyHandle);
}

TextHead.prototype.onRelease = function() {
	// do nothing...
}

// When we press enter, we've finished.
var tool_text = {
	name: 'text',
	buttonImage: 'text.png',
	buttonImageSelected: 'text_select.png',
	onButtonClick: function() {
		console.log('Selected Text');
		return true;
	},
	makeToolHead: function() {
		return new TextHead();
	},
	drawFull: function(data) {
		console.log('tool_text.drawFull', data);
		var pos = data.position;
		var text = data.text;
		var colour = '#000000';
		var font = '30px Helvetica';
		drawText(pos, text, colour, font, context_picture);
	}
};

var tools = {
	pencil: tool_pencil,
	eraser: tool_eraser,
	text: tool_text,
	clear: tool_clear
};

function sendPaintEvent(the_tool, the_points) {
	// console.log('sendPaintEvent', the_tool, the_points);
	socket.emit('paint',
		{
			data: {
				'tool': the_tool,
				'points': the_points,
				'board_id': whiteboard_id
			}
		}
	);
	drawCommand(the_tool, the_points);
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

function drawCommand(the_tool, the_points) {
	if (the_tool in tools) {
		tools[the_tool].drawFull(the_points);
	}
}

$('#canvas2').mousedown(mouseDown);
$('#canvas2').mousemove(mouseMove);
$('#canvas2').mouseup(mouseUp);
document.addEventListener('touchstart', touchDown, false);
document.addEventListener('touchmove', touchMove, false);
document.addEventListener('touchend', mouseUp, false);
document.addEventListener('touchcancel', mouseUp, false);

function trigerToolButton(t) {
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
			document.getElementById('button_' + n2).src = '/static/' + p2;
		}
		document.getElementById('button_' + n).src = '/static/' + p;
	}
}

for (i in tools) {
	// Clojures because javascript is strange...
	function clojure() {
		var name = tools[i].name;
		$('#button_' + name).click(function(e) {trigerToolButton(name);});
	}
	clojure();
}

$(document).ready(function() {

	active_tool = tool_pencil;

	console.log('Board ID:', whiteboard_id);
	
	socket = io.connect('http://' + document.domain + ':' + location.port + '/');
	socket.emit('full image', {data:{'board_id': whiteboard_id}});

	socket.on('paint', function(msg) {
		// console.log('paint', msg);
		if (msg.data.board_id == whiteboard_id) {
			actions = msg.data.actions;
			for (i in actions) {
				// console.log(actions[i].tool, actions[i].points);
				drawCommand(actions[i].tool, actions[i].points);
			}
		}
	});

});