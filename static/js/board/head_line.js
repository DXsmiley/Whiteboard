function LineHead(tool_name, colour, thickness) {
	this.tool_name = tool_name;
	this.p_start = null;
	this.p_end = null;
	this.colour = colour;
	this.thickness = thickness;
	this.distance = 0;
}

LineHead.prototype.onMove = function(p) {
	if (this.p_start == null) {
		this.p_start = new Point(p.x, p.y);
	} else {
		this.p_end = new Point(p.x, p.y);
		drawClear(context_preview);
		drawSegment(this.p_start, this.p_end, context_preview, this.colour, this.thickness);
	}
}

LineHead.prototype.onRelease = function() {
	if (this.p_end != null) {
		var action_data = {
			points: [this.p_start, this.p_end],
			colour: this.colour,
			thickness: this.thickness,
			style: 'straight'
		}
		whiteboard.sendPaintEvent(this.tool_name, action_data);
		drawClear(context_preview);
	}
}