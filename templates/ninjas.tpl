{% extends "info.tpl" %}
{% block title %}Whiteboard{% endblock %}
{% block nav_class_ninjas %}nav_button_current{% endblock %}
{% block content %}
	<div class="container">
		<canvas id="anim_canvas"></canvas>
	</div>
	<script type="text/javascript" src="/static/geometry.js"></script>
	<script type="text/javascript" src="/static/draw.js"></script>
	<script type="text/javascript">
		the_context = document.getElementById('anim_canvas').getContext('2d');
		var points = [
			{x: 0, y: 0},
			{x: 10, y: 10},
			{x: 20, y: 20},
			{x: 30, y: 30},
			{x: 40, y: 40},
			{x: 50, y: 50},
			{x: 60, y: 60},
			{x: 70, y: 70},
			{x: 80, y: 80},
			{x: 90, y: 90},
			{x: 140, y: 10}
		];
		var place = 0;
		function singleDrawTick() {
			if (place < points.length - 1) {
				drawSegment(points[place], points[place + 1], the_context, '#000000', 4);
				place += 1;
				console.log(place);
				window.setTimeout(singleDrawTick, 500);
			}
		}
		console.log(points, points.length);
		window.setTimeout(singleDrawTick, 1000);
	</script>
{% endblock %}