/*
	ToolHead used for the pencil

	Creates solid, freehand lines and shapes.
	This is used for both the pencil and eraser tools.
*/

// Creates a PencilHead
// tool_name :: the name of the tool to create an event for
// color :: the color of the line
// thickness :: redius of the pencil, in pixels
// style :: line style, either 'calligraphy', or 'straight'
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

// Send the data to the server
PencilHead.prototype.pushData = function() {
	if (this.points.length > 1) {
		var last_point = this.points[this.points.length - 1];
		var action_data = {
			points: cleanupLine(this.points),
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

var push_distance_requirement = 50;
var push_point_requirement = 10;
var push_time_requirement = 500;

// Triggered when the mouse moves
PencilHead.prototype.onMove = function(input_point) {
	if (input_point) {
		// Create a timed point and add it to the end of the point list.
		var new_point = {
			x: input_point.x,
			y: input_point.y,
			time: getSysClock()
		}
		this.points.push(new_point);
		var l = this.points.length;
		if (l > 1) {
			// Draw the new line segment
			if (this.style == 'calligraphy') {
				drawLineCalligraphy([this.points[l - 2], new_point], context_preview, this.colour, this.thickness);
			} else {
				drawSegment(this.points[l - 2], new_point, context_preview, this.colour, this.thickness);
			}
			this.distance += distance(this.points[l - 2], new_point);
		}
		// If the line is long enough, and has been drawn for long enough, push the data to the server.
		var dist_req = this.distance > push_distance_requirement;
		var point_req = l > push_point_requirement;
		var time_req = new_point.time - this.points[0].time > push_time_requirement;
		if (dist_req && point_req && time_req) {
			this.pushData();
			this.distance = 0;
		}
	}
}

// When the user releases the mouse, push the drawing to the server
PencilHead.prototype.onRelease = function() {
	this.pushData();
}