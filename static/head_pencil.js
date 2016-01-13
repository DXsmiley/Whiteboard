function PencilHead(tool_name, colour, thickness) {
		this.tool_name = tool_name;
		this.points = Array();
		this.colour = colour;
		this.thickness = thickness;
		this.distance = 0;
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

	PencilHead.prototype.onMove = function(new_point) {
		if (new_point) {
			this.points.push(new_point);
			var l = this.points.length;
			if (l > 1) {
				drawSegment(this.points[l - 2], new_point, context_preview, this.colour, this.thickness);
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