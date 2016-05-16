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
			<button onclick="doclearthing()">Clear!</button>
			<!--
			<script type="text/javascript">
				api = new BoardInterface();
				api.loadPlugin('some_url_here');
				api.require('pencil', 'eraser', 'text', 'clear');
				api.addButtons('pencil', 'eraser', 'text', 'colour:blue', 'colour:orange', 'colour:black', 'undo')
				api.startup();
			</script>
			-->
			<script type="text/javascript" src="/static/api.js"></script>
			<script type="text/javascript">
				// Takes two arguments. ID of the iframe, and the ID of the whiteboard.
				var api = new WhiteboardAPI('whiteboard_frame', 'embed');
				// api.show_toolbar(false);
				function doclearthing() {
					api.clear();
				}
			</script>
		</div>
	</body>
</html>