{% extends "info.tpl" %}
{% block title %}Whiteboard - Feedback{% endblock %}
{% block content %}
	<div class="container">
		<h1>Feedback Box</h1>
		<p>Give some feedback!</p>
		<form action="send" method="post">
			<textarea name="feedback" rows="15" cols="70"></textarea>
			<br><br>
			<input type="submit" value="Send">
		</form>
	</div>
{% endblock %}
