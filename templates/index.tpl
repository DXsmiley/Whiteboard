{% extends "info.tpl" %}
{% set title = 'Whiteboard' %}
{% set nav_page = 'Home' %}
{% block content %}
	<!-- Canvas for the animation -->
	<canvas id="anim_canvas" width="500px" height="350px"></canvas>
	<!-- Rest of page -->
	<div class="container">
		<br><br><br><br><br>
		<h1 class="center">Express Yourself Visually</h1>
		<h3 class="center"><a class="bright" href="/new">Start Drawing Now</a></h3>
		<br><br><br><br><br><br>
		<table>
			<tr>
				<td>
					<h2>Presentation Mode</h2>
					<img src="/static/images/present.png">
					<p>Don't want others messing with the board? With a <a href="/new/protected">protected board</a>, everyone can see it, but only the chosen ones may draw.</p>
				</td>
				<td>
					<h2>Stay Undercover</h2>
					<img src="/static/images/spy.png">
					<p><a href="/new/private">Wear a hat that makes you look shifty</a>. It'll be certain to throw off any... investigators.</p>
				</td>
			</tr>
			<tr>
				<td>
					<h2>Touch Friendly</h2>
					<p>Draw and view on any modern device! The board supports a number of features designed for mobile devices.</p>
				</td>
				<td>
					<h2>Desktop Empowering</h2>
					<p>The whiteboard leverages <i>all three</i> of your mouse buttons to ensure maximum efficiency when using a mouse and keyboard.</p>
				</td>
			</tr>
		</table>
	</div>
	<!-- Scripts to run the animation -->
	<script type="text/javascript" src="/static/js/board/draw.js"></script>
	<script type="text/javascript" src="/static/js/board/auto_drawer.js"></script>
{% endblock %}
