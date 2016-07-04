// Solid shape tool for colours

function SolidShapeTool(name, shortcut_key, colour_func) {
	this.name = name;
	this.shortcut_key = shortcut_key;
	this.colour_func = colour_func;
}

SolidShapeTool.prototype.onButtonClick = function() {
	return true;
};

SolidShapeTool.prototype.makeToolHead = function() {
	return new SolidShapeHead(this.colour_func(), false);
};

SolidShapeTool.prototype.drawFull = function(data) {
	drawPolygon(data.points, data.colour, context_picture);
};

// Solid shape with the 'pencil', draws with current colour.
whiteboard.makeTool(new SolidShapeTool(
	'solid_shape',
	'k',
	() => whiteboard.global_colour
));

// Solid shape with the 'eraser', draws with white.
whiteboard.makeTool(new SolidShapeTool(
	'solid_shape_white',
	'l',
	() => '#ffffff'
));
