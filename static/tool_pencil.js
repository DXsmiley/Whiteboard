function PencilTool() {
	this.line_mode = false;
	this.name = 'pencil';
	this.buttonImage = 'pencil.png';
	this.buttonImageSelected = 'pencil_select.png';
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

PencilTool.prototype.makeToolHead = function() {
	if (this.line_mode) return new LineHead('pencil', whiteboard.global_colour, 2);
	return new PencilHead('pencil', whiteboard.global_colour, 2, 'calligraphy');
};

PencilTool.prototype.drawFull = function(data) {
	if (data.style == 'calligraphy') {
		drawLineCalligraphy(data.points, context_picture, data.colour, 2);
	} else {
		drawLine(data.points, context_picture, data.colour, 2);
	}
};

whiteboard.makeTool(new PencilTool());
