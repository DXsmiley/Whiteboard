<html>
	<head>
		<meta charset="UTF-8">
		<title>{% block title %}{% endblock %}</title>
		<link rel="stylesheet" type="text/css" href="static/css/normalise.css">
		<link rel="stylesheet" type="text/css" href="static/css/style_pages.css">
	</head>
	<body>
		<div class="headder">
			<a class="no_underline" href="/">
				<span class="{% block nav_class_home %}nav_button{% endblock %}">Home</span>
			</a>
			<a class="no_underline" href="/about">
				<span class="{% block nav_class_about %}nav_button{% endblock %}">About</span>
			</a>
			<a class="no_underline" href="https://github.com/DXsmiley/Whiteboard" target="_blank">
				<span class="nav_button">Code</span>
			</a>
		</div>
		<div class="large_container">
			{% block content %}{% endblock %}
		</div>
	</body>
</html>