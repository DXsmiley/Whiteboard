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

		button.colour {
			width: 40px;
			height: 40px;
			border: none;
			border-radius: 50%;
			margin: 3px;
		}

		button.blue {
			background-color: #007fee;
		}

		button.orange {
			background-color: #ee7f00;
		}

		button.black {
			background-color: #2a2a2a;
		}

		button.green {
			background-color: #7fee00;
		}

		button:hover {
			border: 3px solid white;
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
			<button onclick="toggleToolbar()">Toggle Toolbar</button>
			<button onclick="togglePanning()">Toggle Panning</button>
			<p>Change the pen colour:</p>
			<button onclick="api.setColour('#007fee')" class="colour blue"></button>
			<button onclick="api.setColour('#ee7f00')" class="colour orange"></button>
			<button onclick="api.setColour('#2a2a2a')" class="colour black"></button>
			<button onclick="api.setColour('#7fee00')" class="colour green"></button>
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

				var show_tb = true;
				var allow_pan = true;
				
				function toggleToolbar() {
					show_tb = !show_tb;
					api.toolbarVisibility(show_tb);
				}
				
				function togglePanning() {
					allow_pan = !allow_pan;
					api.allowPanning(allow_pan);
				}

			</script>
		</div>
	</body>
</html>