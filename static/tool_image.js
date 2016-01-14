(function () {

	function ImageHead(url) {
		this.url = url;
		$('#modal_image').attr('src', url);
	}

	ImageHead.prototype.onMove = function(p) {
		this.position = new Point(p.x, p.y);
		$('#modal_image').css('left', p.x);
		$('#modal_image').css('top', p.y);
	}

	ImageHead.prototype.onRelease = function() {
		// do nothing..
	}

	ImageHead.prototype.onModalConfirm = function() {
		sendPaintEvent('image', {
			position: this.position,
			url: this.url
		});
		this.onModalCancel();
	}

	ImageHead.prototype.onModalCancel = function() {
		modelClose('.modal_image');
	}

	makeTool({
		name: 'image',
		buttonImage: 'button_image.png',
		buttonImageSelected: 'button_image_select.png',
		onButtonClick: function() {
			return true;
		},
		makeToolHead: function() {
			var url = window.prompt('Enter image url', '');
			if (url) {
				modelOpen('.modal_image');
				return new ImageHead(url);
			}
			return null;
		},
		drawFull: function(data) {
			drawImage(data.url, data.position, context_picture);
		}
	});

})();