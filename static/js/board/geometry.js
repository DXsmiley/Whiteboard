// Creates a new point
function Point(x, y) {
	this.x = x;
	this.y = y;
}

// Returns the distance between two points
function distance(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

// Linear iterpolation between two points
// For example,
//     k = 0 returns a,
//     k = 1 returns b,
//     k = 0.5 returns the point halfway between a and b
function point_lerp(a, b, k) {
	var x = a.x + (b.x - a.x) * k;
	var y = a.y + (b.y - a.y) * k;
	return new Point(x, y);
}

// Cleans a line, so it's not such a mess
function cleanupLine(p) {
	return simplify(p, 1.0, true);
}

// bexier line calculations
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
