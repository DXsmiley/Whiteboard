// The text head used to position the text on the screen.
function TextHead(colour) {
	this.colour = colour;
	this.point = new Point(0, 0);
	this.click_on_text = false;
	// Open the text input dialogue
	whiteboard.modalOpen('.modal_text');
	whiteboard.toolbarActivate('#toolbar_confirm');
	$('#text_input_text').text('Enter Text');
	var passback = this;
	// When the text is clicked, tell is about it.
	$('#text_input_text').mousedown(function(event) {
		passback.click_on_text = true;
	})
}

TextHead.prototype.onMove = function(a) {
	// If the user didn't click on the text, move the text
	// to the new location and select it.
	if (!this.click_on_text) {
		var new_point = new Point(a.x, a.y);
		this.point = new_point;
		// 30ms wait to avoid some issues
		window.setTimeout(function () {
			var e = $('#text_input_text');
			e.css('left', new_point.x + whiteboard.pan_x);
			e.css('top', new_point.y - 8 + whiteboard.pan_y);
			e.selectText();
			e.focus();
		}, 30);
	}
	this.click_on_text = false;
}

// When text is confirmed, send it to the server.
TextHead.prototype.onModalConfirm = function() {
	whiteboard.sendPaintEvent('text', {
		colour: this.colour,
		position: this.point,
		text: $('#text_input_text').text(),
	});
	this.onModalCancel();
}

// When text is cancelled, just close the input dialogue
TextHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_text');
	$('#text_input_text').off('mousedown');
}

// Handle button presses
function TextTool() {
	this.name = 'text';
	this.desktop_only = true;
	this.shortcut_key = 't';
}

// When the button is clicked, select the tool.
TextTool.prototype.onButtonClick = function() {
	return true;
};

// When the user clicks the whiteboard with the too, open the
// text editing dialogue
TextTool.prototype.makeToolHead = function() {
	return new TextHead(whiteboard.global_colour);
}

// Handles other user's text drawing
TextTool.prototype.drawFull = function(data) {
	var pos = {
		x: data.position.x - 1,
		y: data.position.y - 4
	}
	var text = data.text;
	var colour = data.colour;
	var font = '30px Helvetica';
	drawText(pos, text, colour, font, context_picture);
};

whiteboard.makeTool(new TextTool());
