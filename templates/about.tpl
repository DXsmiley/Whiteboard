{% extends "info.tpl" %}
{% set title = 'Whiteboard - About' %}
{% set nav_page = 'About' %}
{% block content %}
	<div class="container">
		<h1>About the Whiteboard</h1>
		<p>Drawing things with a mouse can be an arduous ordeal, fraught with unreadable handwriting and constant tool changes. This whiteboard fixes this problem, providing smooth drawing and a slick interface, so that your ideas come first.</p>
		<p>The Whiteboard takes full advantage of the desktop computer, utilising <i>all three</i> mouse buttons, and numerous keyboard shotcuts for you other hand.</p>
		<p>And if you're on a touch screen, don't worry. We support those too.</p>
		<h2>Features</h2>
		<p>The whiteboard features all the required basics: a pencil, eraser, text tool and several colours, along with the fancier features of image uploading and linking, panning, solid shapes, and a presentation mode.</p>
		<h2>About the Creator</h2>
		<p>This whiteboard was developed by <a href="https://github.com/DXsmiley" target="_blank">myself</a> as a school project.</p>
		<h2>Known Issues</h2>
		<p>Using the text tool on devices that <i>have a touch screen</i>, but identify as <i>non-mobile</i> may cause the whiteboard to freeze. If this happens, refresh the page and avoid using the text tool on that device.</p>
		<p>The Whiteboard is not designed to work with older browsers, such as Internet Explorer. I'm a programmer, not an archaeologist.</p>
	</div>
{% endblock %}
