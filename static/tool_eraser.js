makeTool({
	name: 'eraser',
	buttonImage: 'eraser.png',
	buttonImageSelected: 'eraser_select.png',
	onButtonClick: function() {
		return true;
	},
	makeToolHead: function() {
		return new PencilHead('eraser', '#dddddd', 30);
	},
	drawFull: function(data) {
		drawLine(data.points, context_picture, '#ffffff', 30);
	}
});