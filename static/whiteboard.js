var lastX = 0;
var lastY = 0;
var paint = false;
var whiteboard_id = 'unknown';
var socket = undefined;

// pencil : 0
// eraser : 1
var tool = 0;
// var version = 0;

tool_params = [
	{
		'width': 2,
		'colour': '#484fc0',
		'preview': '#df4b26'
	},
	{
		'width': 30,
		'colour': '#ffffff',
		'preview': '#dddddd'
	}
]

var context1 = document.getElementById('canvas1').getContext('2d'); // bottom layer
var context2 = document.getElementById('canvas2').getContext('2d'); // top layer

// var unsent_commands = Array();
var points = Array();

function sendPaintEvent(the_tool, the_points) {
	socket.emit('paint',
		{
			data: {
				'tool': the_tool,
				'points': the_points,
				'board_id': whiteboard_id
			}
		}
	);
}

function setWhiteboardId(wid) {
	whiteboard_id = wid;
}

function distance(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function cleanup(p) {
	var o = Array();
	var d = 0.0;
	o.push(p[0]);
	for (var i = 1; i < p.length - 1; ++i) {
		d += distance(p[i], o[o.length - 1]);
		if (d > 50.0) {
			d = 0.0;
			o.push(p[i]);
		}
	}
	o.push(p[p.length - 1]);
	return o;
}

// Linear point interpolation
function point_lerp(a, b, k) {
	var x = a.x + (b.x - a.x) * k;
	var y = a.y + (b.y - a.y) * k;
	return {'x': x, 'y': y}
}

function bezier(p, steps) {
	var o = Array();
	o.push(p[0]);
	for (var i = 0; i < p.length - 3; i += 2) {
		for (var j = 0; j < steps; ++j) {
			a = point_lerp(p[i], p[i + 1], j / steps);
			b = point_lerp(p[i + 1], p[i + 1], j / steps);
			c = point_lerp(p[i + 1], p[i + 2], j / steps);
			d = point_lerp(a, b, j / steps);
			e = point_lerp(b, c, j / steps);
			f = point_lerp(d, e, j / steps);
			o.push(f);
		}
	}
	o.push(p[p.length - 1]);
	return o;
}

// Takes in an array of points, and makes a smooth line.
// function smooth(p) {
// 	return bezier(cleanup(p), 30);
// }

function mouseDown(e) {
	// console.log('mousedown');
	lastX = e.pageX;
	lastY = e.pageY;
	paint = true;
	addPiece(lastX, lastY);
}

function mouseUp(e) {
	// console.log('mouseup');
	points = cleanup(points);
	// unsent_commands.push({
	// 	'tool': tool,
	// 	'points': points
	// });
	drawCommand(tool, points);
	context2.clearRect(0, 0, context2.canvas.width, context2.canvas.height);
	paint = false;
	sendPaintEvent(tool, points);
	points = Array();
}

function touchMove(e) {
	mouseMove(e.touches[0]);
	e.preventDefault();
}

function touchDown(e) {
	mouseDown(e.touches[0]);
}

function mouseMove(e) {
	if (paint) {
		// console.log('painting...', e.pageX, e.pageY);
		addPiece(e.pageX, e.pageY);
	}
}

function clearWhiteboard() {
	context1.clearRect(0, 0, context1.canvas.width, context1.canvas.height);
}

function drawCommand(the_tool, the_points) {
	// console.log(the_tool, the_points);
	if (the_tool == -1) {
		clearWhiteboard();
	} else {
		context1.lineJoin = "round";
		context1.strokeStyle = tool_params[the_tool].colour;
		context1.lineWidth = tool_params[the_tool].width;
		// console.log(the_points);
		// the_points = bezier(the_points);
		// console.log(the_points);
		for (var i = 0; i < the_points.length - 1; ++i) {
			context1.beginPath();
			context1.moveTo(the_points[i].x, the_points[i].y);
			context1.lineTo(the_points[i + 1].x, the_points[i + 1].y);
			context1.closePath();
			context1.stroke();
		}
	}
}

$('#canvas2').mousedown(mouseDown);
$('#canvas2').mousemove(mouseMove);
$('#canvas2').mouseup(mouseUp);
document.addEventListener('touchstart', touchDown, false);
document.addEventListener('touchmove', touchMove, false);
document.addEventListener('touchend', mouseUp, false);
document.addEventListener('touchcancel', mouseUp, false);

$('#button_pencil').click(function(e) {
	tool = 0;
	document.getElementById('button_pencil').src = '/static/pencil_select.png';
	document.getElementById('button_eraser').src = '/static/eraser.png';
	/*console.log('button_pencil')*/
});

$('#button_eraser').click(function(e) {
	tool = 1;
	document.getElementById('button_pencil').src = '/static/pencil.png';
	document.getElementById('button_eraser').src = '/static/eraser_select.png';
	// $('#button_pencil').src = 
	// $('#button_eraser').src = '/static/eraser_select.png';
	/*console.log('button_eraser')*/
});

$('#button_clear').click(function(e) {
	sendPaintEvent(-1, []);	
});

function addPiece(x, y) {

	points.push({
		'x': x,
		'y': y
	});

	context2.lineJoin = "round";
	context2.strokeStyle = tool_params[tool].preview;
	context2.lineWidth = tool_params[tool].width;
	context2.beginPath();
	context2.moveTo(lastX, lastY);
	context2.lineTo(x, y);
	context2.closePath();
	context2.stroke();

	// context1.strokeStyle = "#000000";
	// context1.lineJoin = "round";
	// context1.lineWidth = 8;
	// context1.beginPath();
	// context1.moveTo(lastX, lastY);
	// context1.lineTo(x, y);
	// context1.closePath();
	// context1.stroke();

	lastX = x;
	lastY = y;
}

// function getContent() {
// 	console.log('Unsent commands: ', unsent_commands);
// 	$.post("/update",
// 		{
// 			"version": '' + version,
// 			"list_of_commands": JSON.stringify(unsent_commands),
// 			"board": whiteboard_id
// 		},
// 		function (data, status) {
// 			data = JSON.parse(data);
// 			version = data['version'];
// 			console.log('Result data: ', data);
// 			for (i in data.commands) {
// 				drawCommand(data.commands[i].tool, data.commands[i].points);
// 			}
// 			setTimeout(getContent, 1000);
// 		}
// 	);
// 	unsent_commands = Array();
// }

$(document).ready(function() {

	console.log('Board ID:', whiteboard_id);
	
	socket = io.connect('http://' + document.domain + ':' + location.port + '/');
	socket.emit('full image', {data:{'board_id': whiteboard_id}});

	socket.on('paint', function(msg) {
		// console.log('paint', msg);
		if (msg.data.board_id == whiteboard_id) {
			actions = msg.data.actions;
			for (i in actions) {
				console.log(actions[i].tool, actions[i].points);
				drawCommand(actions[i].tool, actions[i].points);
			}
		}
	});

});

// function redraw(){
// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

// 	context.strokeStyle = "#df4b26";
// 	context.lineJoin = "round";
// 	context.lineWidth = 5;
		
// 	for (var i=0; i < clickX.length; i++) {		
// 		context.beginPath();
// 		if(clickDrag[i] && i){
// 			context.moveTo(clickX[i-1], clickY[i-1]);
// 		} else {
// 			context.moveTo(clickX[i]-1, clickY[i]);
// 		}
// 		context.lineTo(clickX[i], clickY[i]);
// 		context.closePath();
// 		context.stroke();
// 	}
// }

// $('document').ready(function() {
	// console.log('Init!');
	// context.width = $('#the_canvas').width;
	// context.height = $('#the_canvas').height;
// });

// setTimeout(getContent, 1000);