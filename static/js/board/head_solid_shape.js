function SolidShapeHead(colour, show_outline) {
	this.points = Array();
	this.colour = colour;
	this.points_since_simplify = 0;
	this.show_outline = show_outline;
}

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

SolidShapeHead.prototype.onMove = function(input_point) {
	if (input_point) {
		this.points.push({x: input_point.x, y: input_point.y});
		drawClear(context_preview);
		drawPolygon(this.points, this.colour, context_preview);
		if (this.show_outline) {
			drawLine(this.points, context_preview, '#eeeeee', 3, true);
		}
		this.points_since_simplify += 1;
		if (this.points_since_simplify >= 1000) {
			console.log('line cleanup');
			this.points_since_simplify = 0;
			this.points = cleanupLine(this.points);
		}
	}
}

SolidShapeHead.prototype.onRelease = function() {
	this.pushData();
}
