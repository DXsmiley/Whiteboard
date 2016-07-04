// Tool used to erase section of the image.
// The 'tool' as opposed to the 'tool head' controls the buttons
// and the initialisation of the tool
function EraserTool() {
	this.name = 'eraser';
	this.shortcut_key = 'e';
}

// When the button is clicked, select the tool
EraserTool.prototype.onButtonClick = function() {
	return true;
};

EraserTool.prototype.makeToolHead = function(button) {
	if (button == 1) {
		// Left button, create pencil head
		return new PencilHead('eraser', '#ffffff', 30, 'straight');
	} else {
		// Middle button, create shape head
		return new SolidShapeHead('#ffffff', true);
	}
};

EraserTool.prototype.drawFull = function(data) {
	drawLine(data.points, context_picture, '#ffffff', 30, false);
};

whiteboard.makeTool(new EraserTool());
