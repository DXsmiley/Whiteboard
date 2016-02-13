function PencilHead(tool_name, colour, thickness) {
	this.tool_name = tool_name;
	this.points = Array();
	this.colour = colour;
	this.thickness = thickness;
	this.distance = 0;
	this.projection = new Point(0, 0);
}

PencilHead.prototype.pushData = function() {
	if (this.points.length > 1) {
		var last_point = this.points[this.points.length - 1];
		var action_data = {
			points: cleanupLine(this.points),
			colour: this.colour,
			thickness: this.thickness
		}
		sendPaintEvent(this.tool_name, action_data);
		this.points = [last_point];
	}
	drawClear(context_preview);
}

var projection_weight = 9;
var use_trace_prediction = false;

PencilHead.prototype.onMove = function(new_point) {
	if (new_point) {
		this.points.push(new_point);
		var l = this.points.length;
		if (l > 1) {
			if (use_trace_prediction) {
				var prev = this.points[l - 2];
				var dx = 6 * (new_point.x - prev.x);
				var dy = 6 * (new_point.y - prev.y);
				this.projection.x = (projection_weight * this.projection.x + dx) / (projection_weight + 1);
				this.projection.y = (projection_weight * this.projection.y + dy) / (projection_weight + 1);
				var tracer = new Point(new_point.x + this.projection.x, new_point.y + this.projection.y);
				drawClear(context_preview);
				drawLine(this.points, context_preview, this.colour, this.thickness)
				drawSegment(new_point, tracer, context_preview, this.colour, this.thickness);
			} else {
				drawSegment(this.points[l - 2], new_point, context_preview, this.colour, this.thickness);
			}
			this.distance += distance(this.points[l - 2], new_point);
		}
		if (this.distance > 2000 && l > 200) {
			this.pushData()
			this.distance = 0;
		}
	}
}

PencilHead.prototype.onRelease = function() {
	this.pushData();
}