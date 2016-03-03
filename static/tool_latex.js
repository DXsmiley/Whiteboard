function getLatexURL() {
	// Todo: better way of getting the LaTeX address.
	tex = $('#modal_latex_input').text();
	url = 'http://' + document.domain + ':5000/i.png?c=' + encodeURIComponent(tex);
	return url;
}

function LatexHead() {
	this.position = new Point(0, 0);
	this.stage = 0;
	// 0 - text input
	// 1 - placement
	modalOpen('.modal_latex');
	$('#modal_latex_input').text('\\sqrt{a^2 + b^2} = c');
	$('#modal_latex_input').show();
	$('#modal_latex_positionable').hide();
}

LatexHead.prototype.onMove = function(p) {
	this.position = new Point(p.x, p.y);
	$('#modal_latex_positionable').css('left', p.x + pan_x);
	$('#modal_latex_positionable').css('top', p.y + pan_y);
}

LatexHead.prototype.onModalConfirm = function() {
	if (this.stage == 1) {
		console.log('LaTeX confirmed');
		sendPaintEvent('image', {
			position: this.position,
			scale: 1,
			url: getLatexURL()
		});
		this.onModalCancel();
	}
	if (this.stage == 0) {
		this.stage = 1;
		$('#modal_latex_input').hide();
		$('#modal_latex_image').hide();
		$('#modal_latex_positionable').show();
		return true; // don't cancel this tool
	}
}

LatexHead.prototype.onModalCancel = function() {
	modalClose('.modal_latex');
}

var latex_get_timeout = null;

$(document).ready(function() {
	// When a key is pressed, update the image to reflect the code.
	$('#modal_latex_input').keydown(function() {
		if (latex_get_timeout != null) {
			window.clearTimeout(latex_get_timeout);
		}
		latex_get_timeout = window.setTimeout(
			function() {
				console.log('Updating LaTeX preview:', getLatexURL());
				$('#modal_latex_image').attr('src', getLatexURL());
				$('#modal_latex_positionable').attr('src', getLatexURL());
			}
		, 400);
	});
});

function LatexTool() {
	this.name = 'latex';
	this.buttonImage = 'button_maths.png';
	this.buttonImageSelected = 'button_maths_selected.png';
	this.desktopOnly = true;
}

LatexTool.prototype.onButtonClick = function() {
	return new LatexHead();
};

makeTool(new LatexTool());