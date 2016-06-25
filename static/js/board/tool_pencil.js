function PencilTool() {
	this.thickness = 3.2;
	this.line_mode = false;
	this.name = 'pencil';
	this.buttonImage = 'pencil.png';
	this.buttonImageSelected = 'pencil_select.png';
	this.shortcut_key = 'p';
}

PencilTool.prototype.onButtonClick = function() {
	return true;
};

PencilTool.prototype.onDoubleClick = function() {
	this.line_mode = !this.line_mode;
	if (this.line_mode) {
		this.buttonImage = 'button_line.png';
		this.buttonImageSelected = 'button_line_select.png';
	} else {
		this.buttonImage = 'pencil.png';
		this.buttonImageSelected = 'pencil_select.png';
	}
	return true;
};

PencilTool.prototype.makeToolHead = function(button) {
	if (button == 1) {
		if (this.line_mode) return new LineHead('pencil', whiteboard.global_colour, this.thickness);
		return new PencilHead('pencil', whiteboard.global_colour, this.thickness, 'calligraphy');
	} else {
		return new SolidShapeHead(whiteboard.global_colour, false);
	}
};

PencilTool.prototype.drawFull = function(data) {
	if (data.style == 'calligraphy') {
		drawLineCalligraphy(data.points, context_picture, data.colour, this.thickness);
	} else {
		drawLine(data.points, context_picture, data.colour, this.thickness);
	}
};

whiteboard.makeTool(new PencilTool());
