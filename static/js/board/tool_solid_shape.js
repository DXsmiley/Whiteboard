function SolidShapeTool() {
	this.name = 'solid_shape';
	this.shortcut_key = 'k';
}

SolidShapeTool.prototype.onButtonClick = function() {
	return true;
};

SolidShapeTool.prototype.makeToolHead = function() {
	return new SolidShapeHead(whiteboard.global_colour, false);
};

SolidShapeTool.prototype.drawFull = function(data) {
	drawPolygon(data.points, data.colour, context_picture);
};

whiteboard.makeTool(new SolidShapeTool());
