modules.create('tool_undo', function() {

	function UndoTool() {
		this.name = 'undo';
	}

	UndoTool.prototype.init = function(x, settings) {
		whiteboard.toolbarAddButton('main', '/static/images/button_undo.png', 9001, this);
	};

	UndoTool.prototype.onButtonClick = function() {
		if (whiteboard.paint_blobs_mine.length > 0) {
			var uid = whiteboard.paint_blobs_mine.pop();
			console.log('Undoing: ', uid, whiteboard.paint_blobs_mine.length);
			whiteboard.sendUndoEvent(uid);
		} else {
			console.log('Nothing to undo');
		}
		return false;
	};

	return UndoTool;

});
