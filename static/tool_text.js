modules.create('tool_text', function () {

	var whiteboard = modules.require('whiteboard');

	function TextHead(colour) {
		this.colour = colour;
		this.point = new Point(0, 0);
		this.click_on_text = false;
		whiteboard.modalOpen('.modal_text');
		whiteboard.toolbarActivate('text');
		$('#text_input_text').text('Enter Text');
		var passback = this;
		$('#text_input_text').mousedown(function(event) {
			passback.click_on_text = true;
		})
	}

	TextHead.prototype.onMove = function(a) {
		// Move text and display
		if (!this.click_on_text) {
			var new_point = new Point(a.x, a.y);
			this.point = new_point;
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

	TextHead.prototype.onModalConfirm = function() {
		whiteboard.sendPaintEvent('text', {
			colour: this.colour,
			position: this.point,
			text: $('#text_input_text').text(),
		});
		this.onModalCancel();
	}

	TextHead.prototype.onModalCancel = function() {
		whiteboard.modalClose('.modal_text');
		$('#text_input_text').off('mousedown');
	}

	function TextTool() {
		this.name = 'text';
	}

	TextTool.prototype.init = function(x, settings) {
		whiteboard.toolbarAddButton('main', '/static/images/text.png', 30, this);
		whiteboard.toolbarAddButton('text', '/static/images/cancel.png', 0, 'modal:cancel');
		whiteboard.toolbarAddButton('text', '/static/images/confirm.png', 1, 'modal:confirm');
	};

	TextTool.prototype.onButtonClick = function() {
		whiteboard.toolSetActive('text');
	};

	TextTool.prototype.makeToolHead = function() {
		return new TextHead(whiteboard.global_colour);
	}

	TextTool.prototype.drawFull = function(data) {
		var pos = data.position;
		var text = data.text;
		var colour = data.colour;
		var font = '30px Helvetica';
		drawText(pos, text, colour, font, whiteboard.context.picture);
	};

	return TextTool;

});