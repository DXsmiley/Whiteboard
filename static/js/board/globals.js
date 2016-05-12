// Retuns number of milliseconds since the epoch.
function getSysClock() {
	var d = new Date();
	return d.getTime();
}

function nullFunction() {
	// a function that does nothing
}

jQuery.fn.selectText = function() {
	var range, selection;
	return this.each(function() {
		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(this);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(this);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	});
};

// These also exist within the whiteboard class.
// I'm not really sure if they should be out here or in there.
this.context_picture = document.getElementById('canvas1').getContext('2d'); // bottom layer
this.context_preview = document.getElementById('canvas2').getContext('2d'); // top layer