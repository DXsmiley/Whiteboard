// Geometric structures

function Point(x, y) {
	this.x = x;
	this.y = y;
}

// Utility functions

function distance(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function point_lerp(a, b, k) {
	var x = a.x + (b.x - a.x) * k;
	var y = a.y + (b.y - a.y) * k;
	var t = a.time + (b.time - a.time) * k;
	return {x: x, y: y, time: t};
}

function lineThroughTwoPoints(p, q) {
	return {
		a: p.y - q.y,
		b: q.x - p.x,
		c: (p.x - q.x) * p.y + (q.y - p.y) * p.x
	}
}

function pointLineDistance(p, l) {
	d = Math.sqrt(l.a * l.a + l.b * l.b);
	return Math.abs((p.x * l.a + p.y * l.b + l.c) / d);
}

// Functions for manipulating lines

function beizierSmoothing(points) {
	var res = [points[0]];
	for (var i = 0; i < points.length - 2; ++i) {
		for (var d = 0; d <= 1; d += 1 / 8) {
			var a = point_lerp(points[i], points[i + 1], 0.5 + d / 2.0);
			var b = point_lerp(points[i + 1], points[i + 2], d / 2.0);
			var c = point_lerp(a, b, d);
			res.push(c);
		}
	}
	res.push(points[points.length - 1]);
	return res;
}

function cleanupLine(points) {
	if (distance(points[0], points[points.length - 1]) < 20) {
		points.push(points[0]);
	}
	points = beizierSmoothing(points);
	return simplify(points, 1.0, true);
}

function boundingBox(line, shrinkage) {
	var box = {
		left: line[0].x,
		right: line[0].x,
		top: line[0].y,
		bottom: line[0].y
	};
	for (var i in line) {
		box.left = Math.min(box.left, line[i].x);
		box.right = Math.max(box.right, line[i].x);
		box.top = Math.min(box.top, line[i].y);
		box.bottom = Math.max(box.bottom, line[i].y);
	}
	if (shrinkage !== undefined) {
		var centre = {
			x: (box.left + box.right) / 2,
			y: (box.top + box.bottom) / 2
		};
		box.left = centre.x - (centre.x - box.left) * shrinkage;
		box.right = centre.x - (centre.x - box.right) * shrinkage;
		box.top = centre.y - (centre.y - box.top) * shrinkage;
		box.bottom = centre.y - (centre.y - box.bottom) * shrinkage;
	}
	return box;
}