<html>
	<head>
		<meta charset="UTF-8">
		<title>Whiteboard</title>
		<link rel="stylesheet" type="text/css" href="static/normalise.css">
		<link rel="stylesheet" type="text/css" href="static/style.css">
	</head>
	<body>
		<div class="container">
			<h1>Listing</h1>
			{% for i in boards %}
				<p><a href="/board/{{i['name']}}">{{i['name']}}</a> : {{i['recency']}}</p>
			{% endfor %}
		</div>
	</body>
</html>
