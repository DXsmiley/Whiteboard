<html>

	<head>
		<meta charset="UTF-8">
		<title>Whiteboard</title>
		<link rel="stylesheet" type="text/css" href="/static/normalise.css">
		<link rel="stylesheet" type="text/css" href="/static/style.css">
	</head>

	<body class="whiteboard">
		<div>
			<canvas id="canvas1" width="1980" height="1080" onclick="void(0)"></canvas>
			<canvas id="canvas2" width="1980" height="1080" onclick="void(0)"></canvas>
		</div>
		<!-- Normal Toolbar -->
		<div class="toolbar">
			<div id="toolbar_normal">
				<img id="button_pencil" src="/static/images/pencil_select.png"><br>
				<img id="button_eraser" src="/static/images/eraser.png"><br>
				<img id="button_text"   src="/static/images/text.png"><br>
				<img id="button_image"  src="/static/images/button_image.png"><br>
				<img id="button_latex"  src="/static/images/col_white.png"><br>
				<img id="button_clear"  src="/static/images/clear.png"><br>
				<img id="colour_blue"   src="/static/images/col_blue.png"><br>
				<img id="colour_red"    src="/static/images/col_red.png"><br>
				<img id="colour_black"  src="/static/images/col_black.png"><br>
			</div>
			<div id="toolbar_confirmcancel">
				<img src="/static/images/cancel.png" id="button_cancel"><br>
				<img src="/static/images/confirm.png" id="button_confirm"><br>
			</div>
			<!-- We can change the colour whenever we want... might change this -->
			</div>
			</div>
		</div>
		<div class="absolute">
			<div id="modal_pane">
				<div class="modal_text">
					<p contenteditable id="text_input_text" class="modal_text">Enter Text</p>
				</div>
				<div class="modal_image">
					<img id="modal_image" src="/static/images/placeholder.png" class="modal_image" />
				</div>
				<div class="modal_latex">
					<center>
						<p contenteditable id="modal_latex_input" class="modal_latex">\sqrt{a^2 + b^2} = c</p>
						<img id="modal_latex_image" class="modal_latex" src="http://localhost:5000/i.png?c=%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D%20%3D%20c">
					</center>
					<img id="modal_latex_positionable" class="modal_latex" src="http://localhost:5000/i.png?c=%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D%20%3D%20c">
				</div>
			</div>
		</div>
	</body>

	<script type="text/javascript" src="//code.jquery.com/jquery-1.9.0.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min.js"></script>
	<script type="text/javascript" src="/static/geometry.js"></script>
	<script type="text/javascript" src="/static/draw.js"></script>
	<script type="text/javascript" src="/static/globals.js"></script>
	<script type="text/javascript" src="/static/head_pencil.js"></script>
	<script type="text/javascript" src="/static/tool_pencil.js"></script>
	<script type="text/javascript" src="/static/tool_eraser.js"></script>
	<script type="text/javascript" src="/static/tool_clear.js"></script>
	<script type="text/javascript" src="/static/tool_text.js"></script>
	<script type="text/javascript" src="/static/tool_image.js"></script>
	<script type="text/javascript" src="/static/tool_latex.js"></script>
	<script type="text/javascript" src="/static/whiteboard.js"></script>
	<script type="text/javascript">setWhiteboardId("{{board_id}}");</script>

</html>