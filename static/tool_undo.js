(function() {

	makeTool({
		name: 'undo',
		buttonImage: 'button_undo.png',
		onButtonClick: function() {
			if (paint_blobs_mine.length > 0) {
				var uid = paint_blobs_mine.pop();
				console.log('Undoing: ', uid, paint_blobs_mine.length);
				sendPaintEvent('undo', uid);
				drawEverything();
			} else {
				console.log('Nothing to undo');
			}
			return false;
		},
		drawFull: function(data) {
			console.log('Registering undo thing...');
			paint_blobs_undone[data] = data;
			// drawEverything();
		}

	});

})();