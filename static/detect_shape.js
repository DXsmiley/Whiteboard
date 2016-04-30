function sum(values) {
	return values.reduce( (p, c) => p + c);
}

function average(values) {
	return sum(values) / values.length;
}

function standardDeviation(values) {
	var av = average(values);
	var deviation = values.map( (x) => (x - av) * (x - av) );
	return Math.sqrt(average(deviation));
}

function detectCircle(points) {
	// Circles have the following properties:
	// Points are equidistant from the centre.
	// The pen doesn't turn around at any point.
	box = boundingBox(points);
	centre = {
		x: (box.left + box.right) / 2,
		y: (box.top + box.bottom) / 2
	};
	var distances = points.map( (p) => distance(p, centre) );
	var rad = average(distances);
	var vra = standardDeviation(distances);
	console.log('Circle Data');
	console.log('Centre:', centre);
	console.log('Radius:', average(distances));
	console.log('Variance: ', standardDeviation(distances));
	console.log('r/v', rad / vra);
	console.log('v/r', vra / rad);
	if (vra / rad < 0.15) {
		var points = [];
		for (var a = 0.0; a < 2 * Math.PI + 0.1; a += Math.PI / 40.0) {
			console.log(a);
			points.push({
				x: centre.x + Math.sin(a) * rad,
				y: centre.y + Math.cos(a) * rad
			});
		}
		console.log(points);
		return points;
	}
	return null;
}

function detectStraightLine(points) {
	var start = points[0];
	var end = points[points.length - 1];
	var line = lineThroughTwoPoints(start, end);
	var length = distance(start, end);
	var offsets = points.map( (point) => pointLineDistance(point, line) );
	if (Math.max(...offsets) < length / 20) {
		return [points[0], points[points.length - 1]];
	}
	return null;
}

function detectShape(points) {
	if (points.length > 5) {
		var l = detectCircle(points);
		if (l !== null) return l;
		var l = detectStraightLine(points);
		if (l != null) return l;
	}
	return points;
}
