makeTool({
	name: 'pencil',
	buttonImage: 'pencil.png',
	buttonImageSelected: 'pencil_select.png',
	onButtonClick: function() {
		console.log('Selected Pencil');
		return true;
	},
	makeToolHead: function() {
		return new PencilHead('pencil', global_colour, 2);
	},
	drawFull: function(data) {
		drawLine(data.points, context_picture, data.colour, 2);
	}
});