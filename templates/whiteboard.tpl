<html>

	<head>
		<meta charset="UTF-8">
		<title>Whiteboard</title>
		<link rel="stylesheet" type="text/css" href="/static/normalise.css">
		<link rel="stylesheet" type="text/css" href="/static/style.css">
	</head>

	<body class="whiteboard" oncontextmenu="return false;">

		<div id="canvas_wrapper">
			<canvas id="canvas1" width="1980" height="1080" onclick="void(0)"></canvas>
			<canvas id="canvas2" width="1980" height="1080" onclick="void(0)"></canvas>
		</div>


		<div class="toolbar">
			<div id="toolbar_normal">
				<img class="toolbar_button" id="button_pencil" src="/static/images/pencil.png"><br>
				<img class="toolbar_button" id="button_eraser" src="/static/images/eraser.png"><br>
				<img class="toolbar_button" id="button_text"   src="/static/images/text.png"><br>
				<img class="toolbar_button" id="button_image"  src="/static/images/button_image.png"><br>
				<img class="toolbar_button" id="button_latex"  src="/static/images/button_maths.png"><br>
				<img class="toolbar_button" id="colour_blue"   src="/static/images/col_blue.png"><br>
				<img class="toolbar_button" id="colour_red"    src="/static/images/col_red.png"><br>
				<img class="toolbar_button" id="colour_black"  src="/static/images/col_black.png"><br>
				<img class="toolbar_button" id="button_clear"  src="/static/images/clear.png"><br>
				<img class="toolbar_button" id="button_undo"   src="/static/images/button_undo.png"><br>
				{% if permissions != 'open' %}
					<img class="toolbar_button" id="button_unlock" src="/static/images/button_unlock.png"><br>
				{% endif %}
			</div>
			<div id="toolbar_cancel">
				<img class="toolbar_button" src="/static/images/cancel.png" id="button_cancel"><br>
				<img class="toolbar_button" src="/static/images/confirm.png" id="button_confirm"><br>
			</div>
			<div id="toolbar_confirm">
			</div>
			<div id="toolbar_image">
				<img class="toolbar_button" src="/static/images/zoom_out.png" id="button_shrink"><br>
				<img class="toolbar_button" src="/static/images/zoom_in.png" id="button_enlarge"><br>				
			</div>
			<div id="toolbar_empty">
				
			</div>
		</div>

		<div class="absolute">
			<div id="modal_pane">
				<div class="modal_text fadein">
					<p contenteditable id="text_input_text" class="modal_text">Enter Text</p>
				</div>
				<div class="modal_image fadein">
					<img id="modal_image" src="/static/images/placeholder.png" class="modal_image" />
				</div>
				<div class="modal_centered_outer">
					<div class="modal_centered_middle">
						<div class="modal_centered_inner">
							<div class="modal_latex fadein">
								<center>
									<p contenteditable id="modal_latex_input" class="modal_latex">\sqrt{a^2 + b^2} = c</p>
									<img id="modal_latex_image" class="modal_latex" src="/static/images/placeholder.png">
								</center>
								<img id="modal_latex_positionable" class="modal_latex" src="/static/images/placeholder.png">
							</div>
							<div class="modal_clear fadein">
								<center>
									<h1>Clear the whiteboard?</h1>
									<img id="modal_clear_button_confirm" src="/static/images/confirm_large.png">
									<img id="modal_clear_button_cancel" src="/static/images/cancel_large.png">
								</center>
							</div>
							<div class="modal_image_select fadein">
								<center>
									<h1>Where do you want to get the image from?</h1>
									<table>
										<tr>
											<td><img id="modal_image_button_upload" src="/static/images/upload_large.png"></td>
											<td><img id="modal_image_button_url" src="/static/images/link_large.png"></td>
											<td><img id="modal_image_button_cancel" src="/static/images/cancel_large.png"></td>
										</tr>
										<tr>
											<td><center><p>Upload</p></center></td>
											<td><center><p>Link</p></center></td>
											<td><center><p>Cancel</p></center></td>
										</tr>
									</table>
									<form id="image_upload_form">
										<input id="image_upload_input" type="file" />
										<button type="submit">Upload</button>
									</form>
								</center>
							</div>
							<div class="modal_image_upload_progress fadein">
								<center>
									<h1>Uploading image...</h1>
									<img src="/static/images/loading.svg">
								</center>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</body>
	
	<script type="text/javascript" src="/static/cookies.js"></script>
	<script type="text/javascript" src="/static/jquery-1.9.0.min.js"></script>
	<script type="text/javascript" src="/static/socket.io.min.js"></script>
	<!-- <script type="text/javascript" src="https://code.ospry.io/v1/ospry.js"></script> -->
	<script type="text/javascript" src="/static/simplify.js"></script>
	<script type="text/javascript" src="/static/geometry.js"></script>
	<script type="text/javascript" src="/static/draw.js"></script>
	<script type="text/javascript" src="/static/globals.js"></script>
	<script type="text/javascript" src="/static/whiteboard.js"></script>
	<script type="text/javascript">whiteboard.setId("{{board_id}}");</script>
	<script type="text/javascript" src="/static/head_pencil.js"></script>
	<script type="text/javascript" src="/static/head_line.js"></script>
	<script type="text/javascript" src="/static/tool_pencil.js"></script>
	<script type="text/javascript" src="/static/tool_eraser.js"></script>
	<script type="text/javascript" src="/static/tool_clear.js"></script>
	<script type="text/javascript" src="/static/tool_text.js"></script>
	<script type="text/javascript" src="/static/tool_image.js"></script>
	<script type="text/javascript" src="/static/tool_latex.js"></script>
	<script type="text/javascript" src="/static/tool_undo.js"></script>
	<script type="text/javascript" src="/static/tool_unlock.js"></script>

	{% if show_controls %}
		<script type="text/javascript">
			whiteboard.toolbarActivate('#toolbar_normal');
			whiteboard.triggerToolButton('pencil');
			whiteboard.triggerColourButton('blue');
		</script>
	{% else %}
		<script type="text/javascript">
			whiteboard.toolbarActivate('#toolbar_empty');
		</script>
	{% endif %}

</html>