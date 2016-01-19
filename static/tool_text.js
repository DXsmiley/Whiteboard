(function () {

	function TextHead(colour) {
		this.colour = colour;
		this.point = new Point(0, 0);
		$('.modal_text').show();
		$('#modal_pane').show();
		$('#text_input_text').text('Enter Text');
	}

	TextHead.prototype.onMove = function(a) {
		// Move text and display
		var new_point = new Point(a.x, a.y);
		this.point = new_point;
		window.setTimeout(function () {
			var e = $('#text_input_text');
			e.css('left', new_point.x);
			e.css('top', new_point.y - 8);
			e.selectText();
			e.focus();
		}, 10);
	}

	TextHead.prototype.onRelease = function() {
		// do nothing...
	}

	TextHead.prototype.onModalConfirm = function() {
		console.log('Committing text paint...');
		sendPaintEvent('text', {
			colour: this.colour,
			position: this.point,
			text: $('#text_input_text').text(),
		});
		this.onModalCancel();
	}

	TextHead.prototype.onModalCancel = function() {
		$('.modal_text').hide();
		$('#modal_pane').hide();
		toolbarActivate('#toolbar_normal');
	}

	$(document).ready(function() {
		$('#text_input_text').keydown(modalKeyHandle);
	});

	makeTool({
		name: 'text',
		buttonImage: 'text.png',
		buttonImageSelected: 'text_select.png',
		desktopOnly: true,
		onButtonClick: function() {
			return true;
		},
		makeToolHead: function() {
			toolbarActivate("#toolbar_confirmcancel");
			return new TextHead(global_colour);
		},
		drawFull: function(data) {
			// console.log('tool_text.drawFull', data);
			var pos = data.position;
			var text = data.text;
			var colour = data.colour;
			var font = '30px Helvetica';
			drawText(pos, text, colour, font, context_picture);
		}
	});

})();