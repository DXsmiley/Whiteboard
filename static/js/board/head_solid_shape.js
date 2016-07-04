/*
	ToolHead that drawn solid shapes.

	Bound to the middle click button on both the eraser and the pencil tools.
*/

// Create a new pencil.
// colour :: colour to draw the shape
// show_outline :: boolean to show an outline when the shape is being drawn
function SolidShapeHead(colour, show_outline) {
	this.points = Array();
	this.colour = colour;
	this.points_since_simplify = 0;
	this.show_outline = show_outline;
}

// Pushes the drawing to the server
SolidShapeHead.prototype.pushData = function() {
	if (this.points.length > 4) {
		var action_data = {
			points: cleanupLine(this.points),
			colour: this.colour			
		};
		whiteboard.sendPaintEvent('solid_shape', action_data, this.pushed_once);
	}
	drawClear(context_preview);
}

// Called when the user moves the mouse
SolidShapeHead.prototype.onMove = function(input_point) {
	if (input_point) {
		// Add the point to the list of points
		this.points.push({x: input_point.x, y: input_point.y});
		// Update the preview
		drawClear(context_preview);
		drawPolygon(this.points, this.colour, context_preview);
		if (this.show_outline) {
			drawLine(this.points, context_preview, '#eeeeee', 3, true);
		}
		// If the line is long, simplify the existing points
		// this reduces the number of points without modifying the shape
		// too much, and thus reduces lag on the client's end
		this.points_since_simplify += 1;
		if (this.points_since_simplify >= 1000) {
			console.log('line cleanup');
			this.points_since_simplify = 0;
			this.points = cleanupLine(this.points);
		}
	}
}

// When the user releases the mouse, send the data to the server
SolidShapeHead.prototype.onRelease = function() {
	this.pushData();
}
