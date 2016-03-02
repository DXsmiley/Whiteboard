function ClearHead() {
	modalOpen('.modal_clear');
}

ClearHead.prototype.onModalConfirm = function() {
	sendPaintEvent('clear', 0);
	modalClose('.modal_clear');
};

ClearHead.prototype.onModalCancel = function() {
	modalClose('.modal_clear');
};

function ClearTool() {
	this.name = 'clear';
	this.buttonImage = 'clear.png';
}

ClearTool.prototype.onButtonClick = function() {
	return new ClearHead();
};

ClearTool.prototype.drawFull = function() {
	drawClear(context_picture);
};

makeTool(new ClearTool());
