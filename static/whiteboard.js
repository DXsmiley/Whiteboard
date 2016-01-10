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
		drawClear(context_preview);
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

var tools = {
	pencil: tool_pencil,
	eraser: tool_eraser
}

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
	if (the_tool == 'clear') {
		drawClear(context_picture);
	} else {
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

function selectTool(t) {
	for (i in tools) {
		var n = tools[i].name;
		var p = tools[i].buttonImage;
		document.getElementById('button_' + n).src = '/static/' + p;
	}
	var n = tools[t].name;
	var p = tools[t].buttonImageSelected;
	document.getElementById('button_' + n).src = '/static/' + p;
	if (tools[t].onButtonClick()) {
		active_tool = tools[t];
	}
}

$('#button_pencil').click(function(e) {selectTool('pencil')});
$('#button_eraser').click(function(e) {selectTool('eraser')});

$('#button_clear').click(function(e) {
	sendPaintEvent('clear', []);	
});

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