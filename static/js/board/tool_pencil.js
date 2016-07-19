/*
	Pencil tool.
*/

function PencilTool() {
	this.thickness = 3.2;
	this.name = 'pencil';
	this.shortcut_key = 'p';
}

// When the pencil button is clicked, select the tool.
PencilTool.prototype.onButtonClick = function() {
	return true;
};

PencilTool.prototype.makeToolHead = function(button) {
	// When the user starts drawing, create the tool head (which handles the drawing)
	if (button == 1) {
		// Left mouse button, normal pencil
		return new PencilHead('pencil', whiteboard.global_colour, this.thickness, 'calligraphy');
	} else {
		// Right mouse button, solid shape
		return new SolidShapeHead(whiteboard.global_colour, false);
	}
};

PencilTool.prototype.drawFull = function(data) {
	// Draw the line, depending on line style.
	if (data.style == 'calligraphy') {
		drawLineCalligraphy(data.points, context_picture, data.colour, this.thickness);
	} else {
		drawLine(data.points, context_picture, data.colour, this.thickness, false);
	}
};

whiteboard.makeTool(new PencilTool());
