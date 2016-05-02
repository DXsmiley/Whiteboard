<!DOCTYPE html>
<html>
	<head>
		<title>Embed Test</title>
	</head>
	<style type="text/css">
		
		#whiteboard_frame {
			border: 1px solid black;
			margin: 10px;
			height: 420px;
			width: 600px;
		}

		#wrapper {
			height: 100%;
			width: 100%;
			background-color: #ccccff;
		}

		body {
			background-color: #ccffcc;
		}

	</style>
	<body>
		<div id="wrapper">
			<iframe src="/b/embed" id="whiteboard_frame">
				<p>Your browser does not support iframes. :(</p>
			</iframe>
			<p>It is possible to enbed the whiteboard within other web pages, like this one here.</p>
			<p>Look at the source code of this page to see how.</p>
		</div>
	</body>
</html>