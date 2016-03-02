(function () {

	var image_scale = 1;
	var scale_per_click = 1.2;

	function ImageHead(url) {
		this.url = url;
		$('#modal_image').attr('src', url);
	}

	ImageHead.prototype.onMove = function(p) {
		this.position = new Point(p.x, p.y);
		$('#modal_image').css('left', p.x + pan_x);
		$('#modal_image').css('top', p.y + pan_y);
	}

	ImageHead.prototype.onRelease = function() {
		// do nothing..
	}

	ImageHead.prototype.onModalConfirm = function() {
		sendPaintEvent('image', {
			position: this.position,
			url: this.url,
			scale: image_scale,
		});
		this.onModalCancel();
	}

	ImageHead.prototype.onModalCancel = function() {
		modalClose('.modal_image');
	}

	$('#button_shrink').click(function (event){
		image_scale /= scale_per_click;
		$("#modal_image").css('transform', 'scale(' + image_scale + ')');
	});

	$('#button_enlarge').click(function (event){
		image_scale *= scale_per_click;
		$("#modal_image").css('transform', 'scale(' + image_scale + ')');
	});

	makeTool({
		name: 'image',
		buttonImage: 'button_image.png',
		buttonImageSelected: 'button_image_select.png',
		desktopOnly: true,
		onButtonClick: function() {
			var url = window.prompt('Enter image url', '');
			if (url) {
				modalOpen('.modal_image');
				return new ImageHead(url);
			}
			return false;
		},
		makeToolHead: function() {
			return null;
		},
		drawFull: function(data) {
			// Callback tp redraw the entire whiteboard when the image has loaded
			function callback(url, position, context) {
				drawEverything();
			}
			drawImageScaled(data.url, data.position, data.scale, context_picture, callback);
		}
	});

})();