function ClearHead() {
	whiteboard.modalOpen('.modal_clear');
}

ClearHead.prototype.onModalConfirm = function() {
	whiteboard.sendPaintEvent('clear', 0);
	whiteboard.modalClose('.modal_clear');
};

ClearHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_clear');
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

whiteboard.makeTool(new ClearTool());

$("#modal_clear_button_confirm").click(function() {
	whiteboard.modalInputConfirm();
})

$("#modal_clear_button_cancel").click(function() {
	whiteboard.modalInputCancel();
})
