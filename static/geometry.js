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
	return {x: x, y: y}
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

function cleanupLine(p) {
	return simplify(p, 1.0, true);
}

function bezier(p, steps) {
	var o = Array();
	o.push(p[0]);
	for (var i = 0; i < p.length - 3; i += 2) {
		for (var j = 0; j < steps; ++j) {
			a = point_lerp(p[i], p[i + 1], j / steps);
			b = point_lerp(p[i + 1], p[i + 1], j / steps);
			c = point_lerp(p[i + 1], p[i + 2], j / steps);
			d = point_lerp(a, b, j / steps);
			e = point_lerp(b, c, j / steps);
			f = point_lerp(d, e, j / steps);
			o.push(f);
		}
	}
	o.push(p[p.length - 1]);
	return o;
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