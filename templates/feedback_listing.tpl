<html>
	<head>
		<meta charset="UTF-8">
		<title>Whiteboard</title>
		<link rel="stylesheet" type="text/css" href="static/normalise.css">
		<link rel="stylesheet" type="text/css" href="static/style.css">
	</head>
	<body>
		<div class="container">
			<h1>Feedback</h1>
			{% for i in feedback %}
				<p>{{i['message']}} | </p>
			{% endfor %}
		</div>
	</body>
</html>