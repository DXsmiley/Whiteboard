// Functions for drawing things on canvases

function drawClearSolid(context) {
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height); 
}

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

function shiftPoint(p, x, y) {
	return new Point(p.x + x, p.y + y);
}

function drawLine(points, context, colour, thickness) {
	if (points.length > 1) {
		for (var i = 1; i < points.length; i++) {
			drawSegment(points[i - 1], points[i], context, colour, thickness);
		}
	}
}

var calligraphy_x = 1;
var calligraphy_y = -1;

function drawLineCalligraphy(points, context, colour, thickness) {
	thickness /= 2;
	if (points.length > 1) {
		for (var i = 1; i < points.length; i++) {
			var dist = distance(points[i - 1], points[i]);
			var time = points[i].time - points[i - 1].time;
			var speed = dist / time;
			if (speed < 4) speed = 4;
			if (speed > 10) speed = 10;
			speed /= 4;
			thk = Math.max(0.8, thickness / speed);
			drawSegment(points[i - 1], points[i], context, colour, thk);
			var p1 = shiftPoint(points[i - 1],   calligraphy_x, calligraphy_y);
			var p2 = shiftPoint(points[i],       calligraphy_x, calligraphy_y);
			drawSegment(p1, p2, context, colour, thk);
			// var p3 = shiftPoint(points[i - 1],  -calligraphy_x, -calligraphy_y);
			// var p4 = shiftPoint(points[i],      -calligraphy_x, -calligraphy_y);
			// drawSegment(p3, p4, context, colour, thickness);
		}
	}
}

function drawText(position, text, colour, font, context) {
	context.textBaseline = 'top';
	context.font = font;
	context.fillStyle = colour;
	context.fillText(text, position.x, position.y);
}

var _imageCache = {};

function drawImage(url, position, context, callback) {
	drawImageScaled(url, position, 1, context, callback);
}

function drawImageScaled(url, position, scale, context, callback) {
	if (!(url in _imageCache)) {
		var image = new Image();
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
		var image = _imageCache[url];
		var w = image.width;
		var h = image.height;
		context.drawImage(image, position.x, position.y, w * scale, h * scale);
	} catch (error) {
		// silence...
	}
}