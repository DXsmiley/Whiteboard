/*
	This is the auto-drawer. It's *super* hard coded, but it's only going to be used on the home page... probably.

	I am completely aware that this is bad design, but I'm not aware of a better way of transmitting this list of
	points to the client, other than using an AJAX request, and I feel like that's overkill.

	Just so you know, I didn't write these by hand.
*/

// List of points to draw. Points with -1 as their x and y co-ordinate are 'invalid', and signal breaks in the line.
var points = [
	{x: 530, y: 156}, {x: 528, y: 144}, {x: 520, y: 124}, {x: 508, y: 114}, {x: 490, y: 105},
	{x: 481, y: 103}, {x: 470, y: 103}, {x: 453, y: 108}, {x: 430, y: 127}, {x: 430, y: 129},
	{x: 422, y: 139}, {x: 416, y: 151}, {x: 407, y: 192}, {x: 405, y: 214}, {x: 405, y: 272},
	{x: 407, y: 304}, {x: 405, y: 305}, {x: 403, y: 313}, {x: 396, y: 317}, {x: 390, y: 323},
	{x: 359, y: 337}, {x: 356, y: 337}, {x: 350, y: 341}, {x: 347, y: 341}, {x: 359, y: 341},
	{x: 391, y: 333}, {x: 412, y: 332}, {x: 427, y: 324}, {x: 434, y: 315}, {x: 435, y: 332},
	{x: 438, y: 339}, {x: 444, y: 338}, {x: 452, y: 329}, {x: 463, y: 321}, {x: 467, y: 319},
	{x: 473, y: 319}, {x: 505, y: 335}, {x: 523, y: 341}, {x: 522, y: 323}, {x: 519, y: 317},
	{x: 514, y: 298}, {x: 514, y: 278}, {x: 512, y: 261}, {x: 506, y: 240}, {x: 504, y: 226},
	{x: 499, y: 211}, {x: 498, y: 192}, {x: 499, y: 179}, {x: 503, y: 161}, {x: 513, y: 158},
	{x: 536, y: 156}, {x: -1, y: -1}, {x: 500, y: 131}, {x: 489, y: 126}, {x: 484, y: 130},
	{x: 484, y: 134}, {x: 500, y: 134}, {x: 501, y: 131}, {x: 497, y: 129}, {x: -1, y: -1},
	{x: 495, y: 208}, {x: 497, y: 208}, {x: 507, y: 200}, {x: 525, y: 195}, {x: 534, y: 195},
	{x: 539, y: 192}, {x: 537, y: 192}, {x: 530, y: 201}, {x: 519, y: 211}, {x: 511, y: 214},
	{x: 507, y: 221}, {x: -1, y: -1}, {x: 436, y: 202}, {x: 432, y: 198}, {x: 426, y: 196},
	{x: 416, y: 196}, {x: 423, y: 205}, {x: 433, y: 210}, {x: 440, y: 210}, {x: -1, y: -1},
	{x: 476, y: 97}, {x: 471, y: 98}, {x: 456, y: 91}, {x: 449, y: 90}, {x: 448, y: 102},
	{x: 427, y: 103}, {x: 412, y: 99}, {x: 412, y: 103}, {x: 416, y: 111}, {x: 425, y: 118},
	{x: 425, y: 121}, {x: 404, y: 124}, {x: 404, y: 126}, {x: 416, y: 136}, {x: 402, y: 143},
	{x: 402, y: 148}, {x: 407, y: 157}, {x: 407, y: 161}, {x: 399, y: 165}, {x: 399, y: 168},
	{x: 412, y: 181}, {x: 399, y: 184}, {x: 399, y: 190}, {x: 404, y: 195}, {x: 383, y: 201},
	{x: 383, y: 206}, {x: 391, y: 214}, {x: 395, y: 215}, {x: 396, y: 217}, {x: 404, y: 221},
	{x: 406, y: 224}, {x: -1, y: -1}, {x: 529, y: 154}, {x: 526, y: 154}, {x: 523, y: 157},
	{x: 521, y: 164}, {x: 513, y: 156}, {x: 512, y: 167}, {x: 502, y: 162}, {x: -1, y: -1},
	{x: 620, y: 299}, {x: 620, y: 297}, {x: 617, y: 296}, {x: 611, y: 297}, {x: 609, y: 300},
	{x: 609, y: 307}, {x: 613, y: 310}, {x: 621, y: 308}, {x: 621, y: 296}, {x: 618, y: 289},
	{x: 616, y: 288}, {x: 613, y: 292}, {x: -1, y: -1}, {x: 612, y: 307}, {x: 609, y: 311},
	{x: 608, y: 323}, {x: 606, y: 326}, {x: -1, y: -1}, {x: 606, y: 315}, {x: 605, y: 316},
	{x: 603, y: 311}, {x: 599, y: 308}, {x: 593, y: 306}, {x: -1, y: -1}, {x: 608, y: 319},
	{x: 620, y: 318}, {x: -1, y: -1}, {x: 603, y: 324}, {x: 593, y: 332}, {x: -1, y: -1},
	{x: 606, y: 326}, {x: 614, y: 346}, {x: -1, y: -1}, {x: 646, y: 274}, {x: 644, y: 275},
	{x: 644, y: 285}, {x: 642, y: 290}, {x: -1, y: -1}, {x: 639, y: 303}, {x: 639, y: 301},
	{x: 634, y: 301}, {x: 634, y: 306}, {x: 637, y: 306}, {x: 634, y: 303}, {x: -1, y: -1},
	{x: 537, y: 112}, {x: 550, y: 103}, {x: 554, y: 98}, {x: -1, y: -1}, {x: 572, y: 78},
	{x: 574, y: 90}, {x: 574, y: 106}, {x: 575, y: 105}, {x: -1, y: -1}, {x: 575, y: 77},
	{x: 592, y: 77}, {x: 598, y: 82}, {x: 599, y: 91}, {x: 596, y: 93}, {x: 567, y: 94},
	{x: 573, y: 92}, {x: 579, y: 95}, {x: 597, y: 111}, {x: -1, y: -1}, {x: 616, y: 104},
	{x: 618, y: 95}, {x: 626, y: 75}, {x: 631, y: 90}, {x: 631, y: 95}, {x: 637, y: 104},
	{x: -1, y: -1}, {x: 616, y: 93}, {x: 634, y: 89}, {x: -1, y: -1}, {x: 652, y: 100},
	{x: 656, y: 90}, {x: 657, y: 83}, {x: 662, y: 75}, {x: 674, y: 104}, {x: -1, y: -1},
	{x: 655, y: 93}, {x: 667, y: 93}, {x: -1, y: -1}, {x: 695, y: 72}, {x: 693, y: 72},
	{x: 690, y: 76}, {x: 686, y: 99}, {x: 683, y: 99}, {x: 682, y: 103}, {x: -1, y: -1},
	{x: 692, y: 75}, {x: 697, y: 75}, {x: 704, y: 81}, {x: 704, y: 87}, {x: 698, y: 89},
	{x: 689, y: 89}, {x: 700, y: 100}, {x: -1, y: -1}, {x: 716, y: 73}, {x: 715, y: 99},
	{x: 718, y: 97}, {x: 718, y: 95}, {x: 724, y: 87}, {x: 726, y: 88}, {x: 731, y: 97},
	{x: 733, y: 97}, {x: 741, y: 72}, {x: -1, y: -1}, {x: 755, y: 69}, {x: 755, y: 78},
	{x: 752, y: 93}, {x: -1, y: -1}, {x: 749, y: 106}, {x: 744, y: 105}, {x: 744, y: 108},
	{x: 747, y: 107}, {x: -1, y: -1}
];

// The drawing context
var the_context = document.getElementById('anim_canvas').getContext('2d');

// The index of the point that the auto-drawer is up to.
var place = 0;

// Translate the point so it's at the correct position on the canvas.
function adjustPoint(p) {
	return {x: p.x - 300, y: p.y - 40};
}

// Draw segment k, using the points k and k + 1.
function drawPart(k) {
	var p1 = points[k];
	var p2 = points[k + 1];
	// Do not draw the point if one of the ends is invalid.
	if (p1.x != -1 && p2.x != -1) drawSegment(adjustPoint(p1), adjustPoint(p2), the_context, '#ff7f2a', 4);
}

// Advance the drawing. Called once per face.
function singleDrawTick() {
	var half_length = Math.floor(points.length / 2);
	if (place < half_length - 1) {
		// Draw two parts of the drawing at once.
		// One of the starts at beginning of the list of points.
		// The other one starts half way through the list.
		drawPart(place);
		drawPart(place + half_length);
		place += 1;
		// The next frame is in 20 ms, making the animation run at 50 FPS.
		window.setTimeout(singleDrawTick, 20);
	}
}

// Starts the animation after 1 second.
window.setTimeout(singleDrawTick, 1000);
