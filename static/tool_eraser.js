function EraserTool() {
	this.name = 'eraser';
	this.buttonImage = 'eraser.png';
	this.buttonImageSelected = 'eraser_select.png';
}

EraserTool.prototype.onButtonClick = function() {
	return true;
};

EraserTool.prototype.makeToolHead = function() {
	return new PencilHead('eraser', '#dddddd', 30, 'straight');
};

EraserTool.prototype.drawFull = function(data) {
	drawLine(data.points, context_picture, '#ffffff', 30);
};

makeTool(new EraserTool());
