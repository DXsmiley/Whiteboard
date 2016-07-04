function ColourShortcut(key, colour) {
	this.name = 'colour_shortcut_' + colour + '_' + key;
	this.colour = colour;
	this.shortcut_key = key;
};

ColourShortcut.prototype.onButtonClick = function() {
	whiteboard.triggerColourButton(this.colour);
};

ColourShortcut.prototype.drawFull = function(data) {
	drawPolygon(data.points, data.colour, context_picture);
};

whiteboard.makeTool(new ColourShortcut('1', 'blue'));
whiteboard.makeTool(new ColourShortcut('2', 'red'));
whiteboard.makeTool(new ColourShortcut('3', 'black'));

whiteboard.makeTool(new ColourShortcut('8', 'blue'));
whiteboard.makeTool(new ColourShortcut('9', 'red'));
whiteboard.makeTool(new ColourShortcut('0', 'black'));
