// Ugly globals
var image_scale = 1;
var scale_per_click = 1.2;
var current_upload_id = null;

// Toolbar button to shrink the image
$('#button_shrink').on(device_click_event, function (event){
	image_scale /= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

// Toolbar button to enlarge the image
$('#button_enlarge').on(device_click_event, function (event){
	image_scale *= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

// Modal button to upload an image
$("#modal_image_button_upload").on('click', function() {
	$("#image_upload_input").click();
});

// Modal button to enter an image url
$("#modal_image_button_url").on(device_click_event, function() {
	var url = window.prompt('Enter image url', '');
	if (url) {
		whiteboard.setToolHead(new ImageHead(url));
	}
});

// Modal button to cancel the image tool
$("#modal_image_button_cancel").on(device_click_event, function() {
	whiteboard.modalInputCancel();
});

// Handle the image uploading process

if (typeof Ospry !== 'undefined') {
	var ospry = new Ospry('pk-test-53z2t7ah9j8jhe2l6zjh9v2h');
}

if (typeof Ospry === 'undefined') {
	// If ospry is broken, show a warning when the user attempts
	// to upload an image.
	$('#image_upload_form').change(function(e) {
		alert('Image uploading is not available');
	});
} else {
	$('#image_upload_form').change(function(e) {

		// Generate a random ID for the image
		// this is not sent anywhere, but lets us check
		// when the user cancells an upload and starts
		// another one before this one is compelte
		var the_id = Math.random();
		current_upload_id = the_id;

		// When the image gets uploaded, open the modal to position the image
		var onUpload = function(err, metadata) {
			console.log('Upload result:');
			console.log(err);
			console.log(metadata);
			if (the_id == current_upload_id) {
				if (err === null) {
					// The upload worked, display the image and let the user
					// position it on the whiteboard
					whiteboard.modalClose('.modal_image_upload_progress');
					var url = metadata.url + '?format=jpeg';
					whiteboard.setToolHead(new ImageHead(url));
				} else {
					// Something went wrong, alert the user
					whiteboard.modalClose('.modal_image_upload_progress');
					alert('Error in image uploading :(');
				}
			} else {
				console.log('Image upload was cancelled');
			}
		};

		// Actually upload the image
		console.log('Uploading...');
		console.log(this, e);
		var up_result = ospry.up({
			form: this,
			imageReady: onUpload,
		});
		// TODO: What does this do?
		console.log(up_result);

		// Show the progress spinner
		whiteboard.modalClose('.modal_image_select');
		whiteboard.modalOpen('.modal_image_upload_progress', '.modal_centered');
		whiteboard.toolbarActivate('#toolbar_cancel');
	});
}

// Objects to interface with the whiteboard

// Handles the placement of images
function ImageHead(url) {
	// Show the image placement modal
	whiteboard.modalClose('.modal_image_upload_progress');
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalOpen('.modal_image');
	whiteboard.toolbarActivate('#toolbar_confirm', '#toolbar_cancel', '#toolbar_image');
	this.url = url;
	$('#modal_image').attr('src', url);
}

// Triggered when the user clicks somewhere on the whiteboard (while the modal is active)
ImageHead.prototype.onMove = function(p) {
	this.position = new Point(p.x, p.y);
	$('#modal_image').css('left', p.x + whiteboard.pan_x);
	$('#modal_image').css('top', p.y + whiteboard.pan_y);
}

// Triggered when the user clicks either the confirm button or presses enter
ImageHead.prototype.onModalConfirm = function() {
	console.log('Painting image.');
	// Send the paint event to the server
	whiteboard.sendPaintEvent('image', {
		position: this.position,
		url: this.url,
		scale: image_scale
	});
	// Close the modal (return to the main whiteboard)
	whiteboard.modalClose('.modal_image');
	$('#modal_image').attr('src', '/static/images/loading.svg');
}

ImageHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_image');
}

// Receives events during image upload
// TODO: Rename this?
function SelectHead() {
	whiteboard.modalOpen('.modal_image_select', '.modal_centered');
}

// This should not be triggered. Ever.
SelectHead.prototype.onModalConfirm = function() {
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalClose('.modal_image_upload_progress');
};

// Closes the modal when the user cancels image upload
SelectHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalClose('.modal_image_upload_progress');
	current_upload_id = null;
}

// Manage the image button the toolbar
function ImageTool() {
	this.name = 'image';
	this.shortcut_key = 'i';
}

// When the button is clicked, open the image selection modal and start handling events
ImageTool.prototype.onButtonClick = function() {
	return new SelectHead();
};

// Draws an image paint event to the whiteboard
ImageTool.prototype.drawFull = function(data) {
	function callback(url, position, context) {
		whiteboard.drawEverything();
	}
	drawImageScaled(data.url, data.position, data.scale, context_picture, callback);
};

whiteboard.makeTool(new ImageTool());
