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
	// console.log('Circle Data');
	// console.log('Centre:', centre);
	// console.log('Radius:', average(distances));
	// console.log('Variance: ', standardDeviation(distances));
	// console.log('r/v', rad / vra);
	// console.log('v/r', vra / rad);
	if (vra / rad < 0.15) {
		var points = [];
		for (var a = 0.0; a < 2 * Math.PI + 0.1; a += Math.PI / 40.0) {
			// console.log(a);
			points.push({
				x: centre.x + Math.sin(a) * rad,
				y: centre.y + Math.cos(a) * rad
			});
		}
		// con/sole.log(points);
		return points;
	}
	return null;
}

function measureStraightness(points) {
	var start = points[0];
	var end = points[points.length - 1];
	var line = lineThroughTwoPoints(start, end);
	var length = distance(start, end);
	var offsets = points.map( (point) => pointLineDistance(point, line) );
	var result = (length / 20) - Math.max(...offsets)
	// console.log(points, '=>', result);
	return result;
}

function detectStraightLine(points) {
	if (measureStraightness(points) > 0) {
		return [points[0], points[points.length - 1]];
	}
	return null;
}

var dp_cache = {};

function cloneHack(object) {
	// Why is this even a thing D:
	return JSON.parse(JSON.stringify(object));
}

function polygonDP(points, place) {
	if (dp_cache[place] === undefined) {
		if (place == points.length - 1) {
			return {
				score: 0,
				shape: [points[place]]
			}
		}
		var best = {
			score: -999999,
			shape: []
		};
		for (var i = place + 1; i < points.length; ++i) {
			var result = cloneHack(polygonDP(points, i));
			result.score += measureStraightness(points.slice(place, i + 1));
			result.score -= 10; // heuristic cost for making a new line
			if (result.score > best.score) {
				result.shape.push(points[place]);
				best = result;
				// console.log(best);
			}
		}
		// console.log(place, best.score, best.shape);
		dp_cache[place] = best;
	}
	return dp_cache[place];
}

function kslope(a, b) {
	var s = 1;
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	if (dx != 0) s = Math.min(s, Math.abs(dy / dx));
	if (dy != 0) s = Math.min(s, Math.abs(dx / dy));
	return s;
}

function rectangularity(points) {
	var slope = kslope(points[0], points[1]);
	slope += kslope(points[1], points[2]);
	slope += kslope(points[2], points[3]);
	slope += kslope(points[3], points[0]);
	return slope;
}

function detectPolygon(points) {
	dp_cache = {};
	var result = polygonDP(points, 0);
	// console.log('Cache:', dp_cache);
	// console.log('Shape:', result.shape);
	if (result.shape.length == 5) {
		// five pointts, four sides
		result.shape[4] = result.shape[0];
		console.log(result.shape, rectangularity(result.shape));
		if (rectangularity(result.shape) < 1) {
			box = boundingBox(result.shape, 0.9);
			return [
				new Point(box.left, box.top),
				new Point(box.left, box.bottom),
				new Point(box.right, box.bottom),
				new Point(box.right, box.top),
				new Point(box.left, box.top)
			];
		} else {
			return result.shape;
		}
	}
	// if (result.shape.length <= 6) {
	// 	return result.shape;
	// }
	return null;
}

function detectShape(points) {
	if (points.length > 5) {
		var l = detectStraightLine(points);
		if (l != null) return l;
		var l = detectPolygon(points);
		if (l != null) return l;
		var l = detectCircle(points);
		if (l !== null) return l;
	}
	return points;
}
