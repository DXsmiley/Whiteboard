// Retuns number of milliseconds since the epoch.
function getSysClock() {
	var d = new Date();
	return d.getTime();
}

// A function that does nothing
function nullFunction() {
	// ┬─┬﻿ ノ( ゜-゜ノ) steady now darling, we wouldn't want to break anything, would we?
}

// jQuery plugin to programatically select text
// sourced from here: http://stackoverflow.com/a/13641884/2002307
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

// The two drawing contexts of the whiteboard.
// context_picture is the actual whiteboard.
// context_preview shows what the user has drawn before it gets sent to the server.
context_picture = document.getElementById('canvas1').getContext('2d'); // bottom layer
context_preview = document.getElementById('canvas2').getContext('2d'); // top layer
