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