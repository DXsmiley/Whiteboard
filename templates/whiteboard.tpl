<html>

	<head>
		<meta charset="UTF-8">
		<title>Whiteboard</title>
		<link rel="stylesheet" type="text/css" href="/static/css/normalise.css">
		<link rel="stylesheet" type="text/css" href="/static/css/style.css">
	</head>

	<body class="whiteboard" oncontextmenu="return false;">

		<div id="canvas_wrapper">
			<canvas id="canvas1" width="1980" height="1080" onclick="void(0)"></canvas>
			<canvas id="canvas2" width="1980" height="1080" onclick="void(0)"></canvas>
		</div>

		<div class="toolbar" id="toolbar_wrapper">
			<div id="toolbar_normal">
				<table id="tb_table">
					<tr>
						<td valign="top">
							<div id="toolbar_scrollable">
								<img class="toolbar_button" id="button_pencil" src="/static/images/pencil.png"><br>
								<img class="toolbar_button" id="button_eraser" src="/static/images/eraser.png"><br>
								<img class="toolbar_button" id="button_text"   src="/static/images/text.png"><br>
								<img class="toolbar_button" id="button_image"  src="/static/images/button_image.png"><br>
								<img class="toolbar_button" id="button_latex"  src="/static/images/button_maths.png"><br>
								<img class="toolbar_button" id="colour_blue"   src="/static/images/col_blue.png"><br>
								<img class="toolbar_button" id="colour_red"    src="/static/images/col_red.png"><br>
								<img class="toolbar_button" id="colour_black"  src="/static/images/col_black.png"><br>
								<img class="toolbar_button" id="button_undo"   src="/static/images/button_undo.png"><br>
							</div>
						</td>
					</tr>
					<tr>
						<td valign="bottom">
							<div id="toolbar_footer">
								{% if permissions != 'open' %}
									<img class="toolbar_button" id="button_unlock" src="/static/images/button_unlock.png"><br>
								{% endif %}
								<img class="toolbar_button" id="button_settings" src="/static/images/settings.png"><br>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div id="toolbar_cancel">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
			</div>
			<div id="toolbar_confirm">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
				<img class="toolbar_button button_confirm" src="/static/images/confirm.png"><br>
			</div>
			<div id="toolbar_image">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
				<img class="toolbar_button button_confirm" src="/static/images/confirm.png"><br>
				<img class="toolbar_button" src="/static/images/zoom_out.png" id="button_shrink"><br>
				<img class="toolbar_button" src="/static/images/zoom_in.png" id="button_enlarge"><br>				
			</div>
			<div id="toolbar_empty">
				
			</div>
		</div>

		<div class="absolute">
			<div id="modal_pane">
				<div class="modal fadein modal_text">
					<p contenteditable id="text_input_text">Enter Text</p>
				</div>
				<div class="modal fadein modal_image">
					<img id="modal_image" src="/static/images/loading.svg"/>
				</div>
				<div class="modal_centered fadein">
					<div class="modal_centered_outer">
						<div class="modal_centered_middle">
							<div class="modal_centered_inner">
								<div class="modal fadein modal_latex">
									<div class="center">
										<p contenteditable id="modal_latex_input">\sqrt{a^2 + b^2} = c</p>
										<img id="modal_latex_image" src="/static/images/loading.svg">
									</div>
									<img id="modal_latex_positionable" src="/static/images/loading.svg">
								</div>
								<div class="modal fadein modal_image_select">
									<div class="center">
										<h1>Where do you want to get the image from?</h1>
										<table>
											<tr>
												<td><img id="modal_image_button_upload" src="/static/images/upload_large.png"></td>
												<td><img id="modal_image_button_url" src="/static/images/link_large.png"></td>
												<td><img id="modal_image_button_cancel" src="/static/images/cancel_large.png"></td>
											</tr>
											<tr>
												<td><div class="center"><p>Upload</p></div></td>
												<td><div class="center"><p>Link</p></div></td>
												<td><div class="center"><p>Cancel</p></div></td>
											</tr>
										</table>
										<form id="image_upload_form">
											<input id="image_upload_input" type="file" />
											<button type="submit">Upload</button>
										</form>
									</div>
								</div>
								<div class="modal fadein modal_image_upload_progress">
									<div class="center">
										<h1>Uploading image...</h1>
										<img src="/static/images/loading.svg">
									</div>
								</div>
								<div class="modal fadein modal_settings">
									<div class="center">
										<h1>Settings and Extra Options</h1>
										<table>
											<tr>
												<td><img id="modal_settings_button_clear" src="/static/images/clear_large.png"></td>
												<td>
													<a id="modal_settings_button_download">
														<img src="/static/images/download_large.png">
													</a>
												</td>
												<td><img id="modal_settings_button_cancel" src="/static/images/cancel_large.png"></td>
											</tr>
											<tr>
												<td><div class="center"><p>Clear</p></div></td>
												<td><div class="center"><p>Save Image</p></div></td>
												<td><div class="center"><p>Return</p></div></td>
											</tr>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="status_message">
			<span>Connecting to server...</span>
		</div>

	</body>
	
	<script type="text/javascript" src="/static/js/lib/cookies.js"></script>
	<script type="text/javascript" src="/static/js/lib/jquery-1.9.0.min.js"></script>
	<script type="text/javascript" src="/static/js/lib/socket.io.min.js"></script>
	<script type="text/javascript" src="https://code.ospry.io/v1/ospry.js"></script>
	<script type="text/javascript" src="/static/js/lib/simplify.js"></script>
	<script type="text/javascript" src="/static/js/board/geometry.js"></script>
	<script type="text/javascript" src="/static/js/board/draw.js"></script>
	<script type="text/javascript" src="/static/js/board/globals.js"></script>
	<script type="text/javascript" src="/static/js/board/whiteboard.js"></script>
	<script type="text/javascript">whiteboard.setId("{{board_id}}");</script>
	<script type="text/javascript" src="/static/js/board/head_pencil.js"></script>
	<script type="text/javascript" src="/static/js/board/head_line.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_pencil.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_eraser.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_clear.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_text.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_image.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_latex.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_undo.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_unlock.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_settings.js"></script>

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