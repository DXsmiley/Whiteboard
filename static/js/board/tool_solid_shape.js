function SolidShapeTool() {
	this.name = 'solid_shape';
}

SolidShapeTool.prototype.onButtonClick = function() {
	return true;
};

SolidShapeTool.prototype.onDoubleClick = function() {
	return true;
};

SolidShapeTool.prototype.makeToolHead = function() {
	return new SolidShapeHead(whiteboard.global_colour, false);
};

SolidShapeTool.prototype.drawFull = function(data) {
	drawPolygon(data.points, data.colour, context_picture);
};

whiteboard.makeTool(new SolidShapeTool());
