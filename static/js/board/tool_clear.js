// Tool which clears the whiteboard

function ClearTool() {
	this.name = 'clear';
}

ClearTool.prototype.drawFull = function() {
	drawClearSolid(context_picture);
};

whiteboard.makeTool(new ClearTool());
