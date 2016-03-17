{% extends "info.tpl" %}
{% block title %}Whiteboard{% endblock %}
{% block nav_class_home %}nav_button_current{% endblock %}
{% block content %}
	<div class="background"></div>
	<div class="container">
		<br><br><br><br>
		<h1>Express Yourself Visually</h1>
		<p><a href="/new">Start Drawing Now</a></p>
		<br><br><br><br><br><br>
		<table>
			<tr>
				<td>
					<h2>Present to others</h2>
					<img src="/static/images/present.png">
					<p>Don't want others drawing on the board? With a protected board, everyone can see it, but only the chosen ones may draw.</p>
				</td>
				<td>
					<h2>Stay Undercover</h2>
					<img src="/static/images/spy.png">
					<p>Paranoid about people stealing your million-dollar idea? Private boards can only be accessed by you.</p>
				</td>
			</tr>
			<tr>
				<td>
					<h2>Touch Friendly</h2>
					<p>Draw and view on any device! Well, maybe. I'm not really sure how well it works.</p>
				</td>
				<td>
					<h2>LaTeX support</h2>
					<p>This one's for the geeks! Format equations with full-featured LaTeX with live preview.</p>
				</td>
			</tr>
		</table>
	</div>
{% endblock %}