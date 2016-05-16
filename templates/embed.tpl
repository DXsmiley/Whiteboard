<!DOCTYPE html>
<html>
	<head>
		<title>Embed Test</title>
	</head>
	<style type="text/css">
		
		#whiteboard_frame {
			border: 1px solid black;
			height: 420px;
			width: 600px;
		}

		#wrapper {
			background-color: #ccccff;
			padding: 20px;
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
			<p>It is also possible to send and receive messages from the embedded board.</p>
			<p>The button below will send a message to clear the board.</p>
			<button onclick="api.clear()">Clear!</button>
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
			</script>
		</div>
	</body>
</html>