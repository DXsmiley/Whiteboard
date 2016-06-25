function EraserTool() {
	this.name = 'eraser';
	this.buttonImage = 'eraser.png';
	this.buttonImageSelected = 'eraser_select.png';
	this.shortcut_key = 'e';
}

EraserTool.prototype.onButtonClick = function() {
	return true;
};

EraserTool.prototype.makeToolHead = function() {
	return new PencilHead('eraser', '#ffffff', 30, 'straight');
};

EraserTool.prototype.drawFull = function(data) {
	drawLine(data.points, context_picture, '#ffffff', 30);
};

whiteboard.makeTool(new EraserTool());
