function PencilHead(tool_name, colour, thickness, style) {
	this.tool_name = tool_name;
	this.points = Array();
	this.colour = colour;
	this.thickness = thickness;
	this.distance = 0;
	this.projection = new Point(0, 0);
	this.style = style;
	this.pushed_once = false;
}

PencilHead.prototype.pushData = function() {
	if (this.points.length > 1) {
		// .slice() makes a copy, might edit a .copy into the prototype later
		this.points = cleanupLine(this.points);
		this.points = detectShape(this.points.slice());
		var last_point = this.points[this.points.length - 1];
		var action_data = {
			points: this.points,
			colour: this.colour,
			thickness: this.thickness,
			style: this.style
		}
		whiteboard.sendPaintEvent(this.tool_name, action_data, this.pushed_once);
		this.pushed_once = true;
		this.points = [last_point];
	}
	drawClear(context_preview);
}

var projection_weight = 9;
var use_trace_prediction = false;

var push_distance_requirement = 2000;
var push_point_requirement = 200;

PencilHead.prototype.onMove = function(input_point) {
	if (input_point) {
		var new_point = {
			x: input_point.x,
			y: input_point.y,
			time: getSysClock()
		}
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
				if (this.style == 'calligraphy') {
					drawLineCalligraphy([this.points[l - 2], new_point], context_preview, this.colour, this.thickness);
				} else {
					drawSegment(this.points[l - 2], new_point, context_preview, this.colour, this.thickness);
				}
			}
			this.distance += distance(this.points[l - 2], new_point);
		}
		if (this.distance > push_distance_requirement && l > push_point_requirement) {
			this.pushData()
			this.distance = 0;
		}
	}
}

PencilHead.prototype.onRelease = function() {
	this.pushData();
}