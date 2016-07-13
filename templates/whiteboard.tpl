<html>

	<head>
		<meta charset="UTF-8">
		<!-- Prevents double-tap to zoom on mobile devices -->
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
		<title>Whiteboard</title>
		<!-- include the style sheets -->
		<link rel="stylesheet" type="text/css" href="/static/css/normalise.css">
		<link rel="stylesheet" type="text/css" href="/static/css/style.css">
	</head>

	<!-- the 'oncontextmenu' prevent the right-click dialogue from popping up, it can still be force-shown with ctrl + right click -->
	<body class="whiteboard" oncontextmenu="return false;">

		<!-- the actual canvases, to which pictures get drawn -->
		<div id="canvas_wrapper">
			<!-- the lower one is the actual board -->
			<canvas id="canvas1" width="1980" height="1080" onclick="void(0)"></canvas>
			<!-- the upper one is the preview of whatever the user is currently drawing. information on here has not been sent to the server -->
			<canvas id="canvas2" width="1980" height="1080" onclick="void(0)"></canvas>
		</div>

		<!-- wrapper around the toolbars -->
		<div class="toolbar" id="toolbar_wrapper">
			<!-- 'normal' toolbar that the user sees most of the time -->
			<div id="toolbar_normal">
				<!-- yes, it's a table, stop complaining, it works -->
				<table id="tb_table">
					<tr>
						<!-- top section of the toolbar, which is most of the stuff-->
						<td valign="top">
							<!-- this section can be scrolled if it goes off the screen -->
							<div id="toolbar_scrollable">
								<img class="toolbar_button" id="button_pencil" src="/static/images/pencil.png"><br>
								<img class="toolbar_button" id="button_eraser" src="/static/images/eraser.png"><br>
								<img class="toolbar_button" id="button_text"   src="/static/images/text.png"><br>
								<img class="toolbar_button" id="button_image"  src="/static/images/button_image.png"><br>
								<img class="toolbar_button" id="colour_blue"   src="/static/images/col_blue.png"><br>
								<img class="toolbar_button" id="colour_red"    src="/static/images/col_red.png"><br>
								<img class="toolbar_button" id="colour_black"  src="/static/images/col_black.png"><br>
								<img class="toolbar_button" id="button_undo"   src="/static/images/button_undo.png"><br>
							</div>
						</td>
					</tr>
					<tr>
						<!-- the settings and unlock buttons are in the corner -->
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
			<!-- toolbar with a cancel button only -->
			<div id="toolbar_cancel">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
			</div>
			<!-- toolbar with a confirm and cancel button -->
			<div id="toolbar_confirm">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
				<img class="toolbar_button button_confirm" src="/static/images/confirm.png"><br>
			</div>
			<!-- toolbar with a confirm, cancel and two zoom buttons. used for image placement -->
			<div id="toolbar_image">
				<img class="toolbar_button button_cancel"  src="/static/images/cancel.png"><br>
				<img class="toolbar_button button_confirm" src="/static/images/confirm.png"><br>
				<img class="toolbar_button" src="/static/images/zoom_out.png" id="button_shrink"><br>
				<img class="toolbar_button" src="/static/images/zoom_in.png" id="button_enlarge"><br>				
			</div>
			<!-- an empty toolbar -->
			<div id="toolbar_empty">
				
			</div>
		</div>

		<!-- wrapper around the modal popups -->
		<div class="absolute">
			<div id="modal_pane">
				<!-- text tool modal -->
				<div class="modal fadein modal_text">
					<p contenteditable id="text_input_text">Enter Text</p>
				</div>
				<!-- image placement modal -->
				<div class="modal fadein modal_image">
					<img id="modal_image" src="/static/images/loading.svg"/>
				</div>
				<!-- wrapper around centered modal dialogues, such as the image upload and settings tool -->
				<div class="modal_centered fadein">
					<div class="modal_centered_outer">
						<div class="modal_centered_middle">
							<div class="modal_centered_inner">
								<!-- modal for the latex input (currently non-functional) -->
								<div class="modal fadein modal_latex">
									<div class="center">
										<p contenteditable id="modal_latex_input">\sqrt{a^2 + b^2} = c</p>
										<img id="modal_latex_image" src="/static/images/loading.svg">
									</div>
									<img id="modal_latex_positionable" src="/static/images/loading.svg">
								</div>
								<!-- image selection modal: has upload, link from url, and cancel buttons -->
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
								<!-- just shows a spinner, used alongside a single cancel button in the toolbar -->
								<div class="modal fadein modal_image_upload_progress">
									<div class="center">
										<h1>Uploading image...</h1>
										<img src="/static/images/loading.svg">
									</div>
								</div>
								<!-- settings modal -->
								<div class="modal fadein modal_settings">
									<div class="center">
										<h1>Settings and Extra Options</h1>
										<table>
											<tr>
												<!-- clear board button -->
												<td><img id="modal_settings_button_clear" src="/static/images/clear_large.png"></td>
												<!-- same board as image button -->
												<td>
													<a id="modal_settings_button_download">
														<img src="/static/images/download_large.png">
													</a>
												</td>
												<!-- help button, opens help page in new tab -->
												<td>
													<a id="modal_settings_button_help" href="/docs" target="_blank">
														<img src="/static/images/help.png">
													</a>
												</td>
												<!-- closes the settings modal -->
												<td><img id="modal_settings_button_cancel" src="/static/images/cancel_large.png"></td>
											</tr>
											<!-- Text labels under the buttons -->
											<tr>
												<td><div class="center"><p>Clear</p></div></td>
												<td><div class="center" id="modal_settings_text_download"><p>Save Image</p></div></td>
												<td><div class="center"><p>Help</p></div></td>
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

		<!-- Status popup, changes to a warning if the client disconnects from the server -->
		<div id="status_message" class="popup">
			<p id="status_message_text">Connecting to server...</p>
		</div>

		<!-- Popup requesting the user provides some feedback about the board -->
		<div id="feedbackpopup" class="popup">
			<p>Hey, there! You seem to be using the whiteboard a lot! Want to tell us your thoughts?</p>
			<div>
				<a href="{{ feedback_form }}" target="_blank"><button onclick="feedbackPopupClose(true)">Sure</button></a>
				<button onclick="feedbackPopupClose(false)">No Thanks</button>
			</div>
		</div>

		<!-- Popup telling the user how to navigate the board -->
		<div id="panningpopup" class="popup">
			<p>Top tip: Use the <i>right mouse button</i> or a <i>two finger swipe</i> to navigate around the board.</p>
			<div>
				<button onclick="panningPopupClose()">Great!</button>
			</div>
		</div>

	</body>
	
	<!-- Get all the script files! -->
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
	<script type="text/javascript" src="/static/js/board/head_solid_shape.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_pencil.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_eraser.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_clear.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_text.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_image.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_latex.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_solid_shape.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_undo.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_unlock.js"></script>
	<script type="text/javascript" src="/static/js/board/tool_settings.js"></script>
	<script type="text/javascript" src="/static/js/board/colour_shortcuts.js"></script>

	{% if show_controls %}
		<!-- Script to setup the board for editing -->
		<script type="text/javascript">

			// Show the main toolbar and select the default tools

			whiteboard.toolbarActivate('#toolbar_normal');
			whiteboard.triggerToolButton('pencil');
			whiteboard.triggerColourButton('blue');

			// Feedback popup

			function feedbackPopupShow() {
				console.log('Showing feedback popup.');
				$("#feedbackpopup").css('bottom', '20px');
			}

			function feedbackPopupClose(result) {
				console.log('Closing feedback popup.');
				$("#feedbackpopup").css('bottom', '-150px');
				if (result) {
					// User went to the feedback page.
					// Ask them again in several months.
					Cookies.set('feedbackpopup', 1, {'expires': 300});
				} else {
					// User didn't go to the feedback page :(
					// Ask them again in a bit over a month.
					Cookies.set('feedbackpopup', 1, {'expires': 40});
				}
			}

			if (Cookies.get('feedbackpopup') === undefined) {
				// Show in 15 minutes
				console.log('Setting feedback popup timer.');
				window.setTimeout(feedbackPopupShow, 1000 * 60 * 15);
			}

			// Panning tip popup

			function panningPopupShow() {
				console.log('Showing panning popup.');
				$("#panningpopup").css('bottom', '20px');
			}

			function panningPopupClose() {
				console.log('Closing panning popup.');
				$('#panningpopup').css('bottom', '-150px');
				Cookies.set('panningpopup', 1, {'expires': 800});
			}

			if (Cookies.get('panningpopup') === undefined) {
				window.setTimeout(panningPopupShow, 1000 * 5);
			}

		</script>
	{% else %}
		<!-- Activates if the user can't edit the board : empty toolbar -->
		<script type="text/javascript">
			whiteboard.toolbarActivate('#toolbar_empty');
		</script>
	{% endif %}

</html>
