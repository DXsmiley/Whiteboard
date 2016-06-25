function EraserTool() {
	this.name = 'eraser';
	this.buttonImage = 'eraser.png';
	this.buttonImageSelected = 'eraser_select.png';
}

EraserTool.prototype.onButtonClick = function() {
	return true;
};

EraserTool.prototype.makeToolHead = function(button) {
	if (button == 1) {
		return new PencilHead('eraser', '#ffffff', 30, 'straight');
	} else {
		return new SolidShapeHead('#ffffff', true);
	}
};

EraserTool.prototype.drawFull = function(data) {
	drawLine(data.points, context_picture, '#ffffff', 30);
};

whiteboard.makeTool(new EraserTool());
