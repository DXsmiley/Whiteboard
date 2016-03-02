function UndoTool() {
	this.name = 'undo';
	this.image = 'button_undo.png',
}

UndoTool.prototype.onButtonClick = function() {
	if (paint_blobs_mine.length > 0) {
		var uid = paint_blobs_mine.pop();
		console.log('Undoing: ', uid, paint_blobs_mine.length);
		sendUndoEvent(uid);
		drawEverything();
	} else {
		console.log('Nothing to undo');
	}
	return false;
};
