// Functions for drawing things on canvases

// Fills the canvas with solid white
function drawClearSolid(context) {
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height); 
}

// Erases everything on the canvas, making it completely transparent
function drawClear(context) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Draw a line given the two endpoints, colour and thickness
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

// Translate a point by a given x and y value.
function shiftPoint(p, x, y) {
	return new Point(p.x + x, p.y + y);
}

// Draws contiguous line segments through a list of points given the colour and thickness
// Setting `loop` to true creates an additional line between the first and last points
function drawLine(points, context, colour, thickness, loop) {
	if (points.length > 1) {
		context.lineJoin = "round";
		context.strokeStyle = colour;
		context.lineWidth = thickness;
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < points.length; i++) {
			context.lineTo(points[i].x, points[i].y);
		}
		if (!loop) {
			for (var i = points.length - 2; i > 0; i--) {
				context.lineTo(points[i].x, points[i].y);
			}
		}
		context.closePath();
		context.stroke();
	}
}

var calligraphy_x = 1;
var calligraphy_y = -1;

// Draw a continuous line in 'caligraphic' style
// This means the stroke is diagonally slanted to show pen tilt
// Also, the thickness of the line is altered slightly by the speed the line was drawn
// Points need to have a timstamp on them for this to work properly
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

// Draw text at a particular position
function drawText(position, text, colour, font, context) {
	context.textBaseline = 'top';
	context.font = font;
	context.fillStyle = colour;
	context.fillText(text, position.x, position.y);
}

var _imageCache = {};

// Draw an image at a particular position
// The callback is called when the image is loaded, if it hasn't already done so
function drawImage(url, position, context, callback) {
	drawImageScaled(url, position, 1, context, callback);
}

// Draws a scaled image
// The callback is called when the image is loaded, if it hasn't already done so
function drawImageScaled(url, position, scale, context, callback) {
	if (!(url in _imageCache)) {
		// If the image isn't loaded, load it.
		var image = new Image();
		image.src = url;
		_imageCache[url] = image;
		// When the image has loaded, actually draw it, and trigger the callback
		image.onload = function() {
			var w = image.width;
			var h = image.height;
			context.drawImage(image, position.x, position.y, w * scale, h * scale);
			callback(url, position, context);
		}
	}
	try {
		// actually draw the image
		var image = _imageCache[url];
		var w = image.width;
		var h = image.height;
		context.drawImage(image, position.x, position.y, w * scale, h * scale);
	} catch (error) {
		// if an error is raised, it means the image hasn't loaded yet
	}
}

// Draws a filled shape
function drawPolygon(points, colour, context) {
	context.fillStyle = colour;
	context.beginPath();
	context.moveTo(points[0].x, points[0].y);
	for (var i in points) {
		context.lineTo(points[i].x, points[i].y);
	}
	context.closePath();
	context.fill();
}
