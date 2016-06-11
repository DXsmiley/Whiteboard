function SolidShapeHead(colour) {
	console.log('SolidShapeHead');
	this.points = Array();
	this.colour = colour;
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
		console.log('onMove');
		this.points.push({x: input_point.x, y: input_point.y});
		drawClear(context_preview);
		drawPolygon(this.points, this.colour, context_preview);
	}
}

SolidShapeHead.prototype.onRelease = function() {
	this.pushData();
}
