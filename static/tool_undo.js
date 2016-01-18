(function() {

	makeTool({
		name: 'undo',
		buttonImage: 'button_undo.png',
		onButtonClick: function() {
			if (paint_blobs_mine.length > 0) {
				var uid = paint_blobs_mine.pop();
				console.log('Undoing: ', uid, paint_blobs_mine.length);
				sendUndoEvent(uid);
				drawEverything();
			} else {
				console.log('Nothing to undo');
			}
			return false;
		},
		drawFull: function(data) {
			console.warn('Drawing undo event. This shouldn\'t be a thing')
		}

	});

})();