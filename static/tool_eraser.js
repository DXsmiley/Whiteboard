modules.create('tool_eraser', function() {

	var whiteboard = modules.require('whiteboard');
	var PencilHead = modules.require('pencil_head');

	function EraserTool() {
		this.name = 'eraser';
	}

	EraserTool.prototype.init = function(nothing, settings) {
		whiteboard.toolbarAddButton('main', '/static/images/eraser.png', 10, this);
	};

	EraserTool.prototype.onButtonClick = function() {
		console.log('Clicked eraser button');
		whiteboard.toolSetActive('eraser');
	};

	EraserTool.prototype.makeToolHead = function() {
		return new PencilHead('eraser', '#ffffff', 30, 'straight');
	};

	EraserTool.prototype.drawFull = function(data) {
		drawLine(data.points, whiteboard.context_picture, '#ffffff', 30);
	};

	// whiteboard.makeTool(new EraserTool());

	return EraserTool;

});
