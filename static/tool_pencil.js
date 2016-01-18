(function() {

	var line_mode = false;

	var pencil_tool = {
		name: 'pencil',
		buttonImage: 'pencil.png',
		buttonImageSelected: 'pencil_select.png',
		onButtonClick: function() {
			console.log('Selected Pencil');
			return true;
		},
		onDoubleClick: function() {
			line_mode = !line_mode;
			if (line_mode) {
				pencil_tool.buttonImage = 'button_line.png';
				pencil_tool.buttonImageSelected = 'button_line_select.png';
			} else {
				pencil_tool.buttonImage = 'pencil.png';
				pencil_tool.buttonImageSelected = 'pencil_select.png';
			}
			return true;
		},
		makeToolHead: function() {
			if (line_mode) return new LineHead('pencil', global_colour, 2);
			return new PencilHead('pencil', global_colour, 2);
		},
		drawFull: function(data) {
			drawLine(data.points, context_picture, data.colour, 2);
		}
	}

	makeTool(pencil_tool);

})();