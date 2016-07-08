<html>
	<head>
		<meta charset="UTF-8">
		<title>{{ title }}</title>
		<!-- stylesheets requires for the information pages on the website -->
		<link rel="stylesheet" type="text/css" href="static/css/normalise.css">
		<link rel="stylesheet" type="text/css" href="static/css/style_pages.css">
		<link rel="stylesheet" type="text/css" href="static/css/printability.css">
	</head>
	<body>
		<!-- navigation bar at the top -->
		<div class="headder">
			<a class="no_underline" href="/">
				<!-- These expressions are used to determine the nav button that should be highlighted -->
				<span class="{{ 'nav_button_current' if nav_page == 'Home' else 'nav_button' }}">Home</span>
			</a>
			<a class="no_underline" href="/about">
				<span class="{{ 'nav_button_current' if nav_page == 'About' else 'nav_button' }}">About</span>
			</a>
			<a class="no_underline" href="/docs">
				<span class="{{ 'nav_button_current' if nav_page == 'Docs' else 'nav_button' }}">Docs</span>
			</a>
			<a class="no_underline" href="/legal">
				<span class="{{ 'nav_button_current' if nav_page == 'Legal' else 'nav_button' }}">Legal</span>
			</a>
			<a class="no_underline" href="https://github.com/DXsmiley/Whiteboard" target="_blank">
				<span class="nav_button">Code</span>
			</a>
		</div>
		<div class="large_container">
			<!-- Main content of the page gets inserted here -->
			{% block content %}{% endblock %}
		</div>
	</body>
</html>
