<html>
	<head>
		<meta charset="UTF-8">
		<title>{{ title }}</title>
		<link rel="stylesheet" type="text/css" href="static/css/normalise.css">
		<link rel="stylesheet" type="text/css" href="static/css/style_pages.css">
	</head>
	<body>
		<div class="headder">
			<a class="no_underline" href="/">
				<span class="{{ 'nav_button_current' if nav_page == 'Home' else 'nav_button' }}">Home</span>
			</a>
			<a class="no_underline" href="/about">
				<span class="{{ 'nav_button_current' if nav_page == 'About' else 'nav_button' }}">About</span>
			</a>
			<a class="no_underline" href="/ninjas">
				<span class="{{ 'nav_button_current' if nav_page == 'Ninjas' else 'nav_button' }}">Ninjas</span>
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