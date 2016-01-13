makeTool({
	name: 'clear',
	buttonImage: 'clear.png',
	onButtonClick: function() {
		sendPaintEvent('clear', []);
		// This is just a button.
		return false;
	},
	drawFull: function(data) {
		drawClear(context_picture);
	}
});