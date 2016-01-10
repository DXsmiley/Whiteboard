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
	return {'x': x, 'y': y}
}

// Functions for manipulating lines

function cleanupLine(p) {
	var o = Array();
	var d = 0.0;
	o.push(p[0]);
	for (var i = 1; i < p.length - 1; ++i) {
		d += distance(p[i], o[o.length - 1]);
		if (d > 50.0) {
			d = 0.0;
			o.push(p[i]);
		}
	}
	o.push(p[p.length - 1]);
	return o;
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