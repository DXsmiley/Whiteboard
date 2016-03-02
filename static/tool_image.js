var image_scale = 1;
var scale_per_click = 1.2;

$('#button_shrink').click(function (event){
	image_scale /= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

$('#button_enlarge').click(function (event){
	image_scale *= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

function ImageHead(url) {
	this.url = url;
	$('#modal_image').attr('src', url);
}

ImageHead.prototype.onMove = function(p) {
	this.position = new Point(p.x, p.y);
	$('#modal_image').css('left', p.x + pan_x);
	$('#modal_image').css('top', p.y + pan_y);
}

ImageHead.prototype.onModalConfirm = function() {
	sendPaintEvent('image', {
		position: this.position,
		url: this.url,
		scale: image_scale
	});
	modalClose('.modal_image');
}

ImageHead.prototype.onModalCancel = function() {
	modalClose('.modal_image');
}

function ImageTool() {
	this.name = 'image';
	this.buttonImage = 'button_image.png';
	this.buttonImageSelected = 'button_image_select.png';
	this.desktopOnly = true;
}

ImageTool.prototype.onButtonClick = function() {
	var iurl = window.prompt('Enter image url', '');
	if (iurl) {
		modalOpen('.modal_image');
		return new ImageHead(iurl);
	}
	return false;

};

ImageTool.prototype.drawFull = function(data) {
	function callback(url, position, context) {
		drawEverything();
	}
	drawImageScaled(data.url, data.position, data.scale, context_picture, callback);
};

makeTool(new ImageTool());
