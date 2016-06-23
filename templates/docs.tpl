{% extends "info.tpl" %}
{% set title = 'Whiteboard - Docs' %}
{% set nav_page = 'Docs' %}
{% block content %}
	<div class="container">
		<h1>Docs</h1>

		<h2>Navigating the Board</h2>

		<img src="/static/images/mouse_right.png" class="floatleft">
		<p>If you are using a mouse, you can <i>right click</i> and drag to pan around the board.</p>
		<p>If you are using a touch screen, simply drag the board using two fingers.</p>

		<h2>Adding Collaborators</h2>

		<p>Having multiple people drawing on the same board is a key feature. To get other people drawing on your board, simply go to your board and give them the URL, which can be found in the address bar.</p>

		<p>Collaborators will be able to do anything that you can, including erasing the board and sharing it with others, shoudl they so wish.</p>

		<h2>Tools</h2>

		<img src="/static/images/pencil.png" class="floatleft">
		<h3>Pencil</h3>
		<p>The default tool, and probably the one you will use the most. When in use, simply click (or tap) the board and drag to produce lines and shapes.</p>

		<img src="/static/images/eraser.png" class="floatleft">
		<h3>Eraser</h3>
		<p>Similar to the pencil, but for erasing marks made on the whiteboard. Note that the radius of the eraser is much larger than the pencil.</p>

		<img src="/static/images/text.png" class="floatleft">
		<h3>Text</h3>
		<p>Select this tool, then click anywhere on the board and you will be able to input text. Press <i>enter</i> to finish, or <i>escape</i> to cancel. Alternatively, you can click the confirm and cancel buttons in the tool bar. While typing, you can click again to reposition the text.</p>

		<img src="/static/images/button_image.png" class="floatleft">
		<h3>Image</h3>
		<p>Clicking this will give you the option to either upload an image or retrieve one from a URL. After doing so, click on the canvas to position the image. The magnifying glass buttons in the toolbar will allow you to enlarge or shrink the image. When you are happy, click the confirm button in the toolbar, or click the cancel button to not place the image and return to the whiteboard.</p>

		<img src="/static/images/col_black.png" class="floatleft">
		<h3>Colours</h3>
		<p>By default, there are three colours to pick from. Click or tap one to use it. The current colour will affect the pencil and text tools.</p>

		<img src="/static/images/button_undo.png" class="floatleft">
		<h3>Undo</h3>
		<p>Pressing undo will reverse your previous action, without interfering with any else's work. All actions can be undone, including clearing the board. Note that you cannot 'undo' the actions of other people, but you can erase what they draw.</p>

		<img src="/static/images/settings.png" class="floatleft">
		<h3>Settings</h3>
		<p>The settings buttons provides a few extra options. The <i>clear</i> button will clear the whiteboard. If you hit this by accident, you can press the undo button to get the board back. The <i>save image</i> button will allow you to save an image of the whiteboard to your own computer. The <i>help</i> button opens this page. It does so in a new tab, so the whiteboard remains accessable. The <i>return</i> button closes the settings panal and returns you to the whiteboard.</p>

		<h2>Advanced Use</h2>

		<img src="/static/images/mouse_middle.png" class="floatleft">
		<h3>Drawing Shapes</h3>
		<p>Both the pencil and eraser tools allow you to draw solid shapes. When using either of the tools, hold down the <i>middle mouse button</i> and drag to produce a filled shape.</p>

		<h3>Keyboard shortcuts</h3>
		<table>
			<thead>
				<tr>
					<td>Key</td>
					<td>Command</td>
				</tr>
			</thead>
			<tbody class="stripes">
				<tr>
					<td>P</td>
					<td>Activate pencil tool</td>
				</tr>
				<tr>
					<td>E</td>
					<td>Activate eraser tool</td>
				</tr>
				<tr>
					<td>T</td>
					<td>Activate text tool</td>
				</tr>
				<tr>
					<td>I</td>
					<td>Open image selection panel</td>
				</tr>
				<tr>
					<td>U</td>
					<td>Undo last action</td>
				</tr>
				<tr>
					<td>S</td>
					<td>Open settings panel</td>
				</tr>
				<tr>
					<td>Enter</td>
					<td>Confirm action</td>
				</tr>
				<tr>
					<td>Escape</td>
					<td>Cancel action</td>
				</tr>
				<tr>
					<td>Space</td>
					<td>Toggles between the text and eraser tools. Actives the pencil tool if another tool is selected.</td>
				</tr>
				<tr>
					<td>C</td>
					<td>Clear the board, prompts with warning</td>
				</tr>
			</tbody>
		</table>
	</div>
{% endblock %}