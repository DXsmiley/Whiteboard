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

var _imageCache = {}

function drawImage(url, position, context, callback) {
	drawImageScaled(url, position, 1, context, callback);
}

function drawImageScaled(url, position, scale, context, callback) {
	if (!(url in _imageCache)) {
		image = new Image();
		image.src = url;
		_imageCache[url] = image;
		image.onload = function() {
			var w = image.width;
			var h = image.height;
			context.drawImage(image, position.x, position.y, w * scale, h * scale);
			callback(url, position, context);
		}
	}
	try {
		var w = image.width;
		var h = image.height;
		context.drawImage(_imageCache[url], position.x, position.y, w * scale, h * scale);
	} catch (error) {
		// silence...
	}
}