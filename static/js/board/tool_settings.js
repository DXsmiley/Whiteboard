// When the 'clear' button is clicked, clear the board.
$('#modal_settings_button_clear').click(function() {
	whiteboard.modalClose('.modal_settings');
	whiteboard.sendPaintEvent('clear', 0);
});

// When the return button is clicked, close the settings panal.
$('#modal_settings_button_cancel').click(function() {
	whiteboard.modalClose('.modal_settings');
});

// When the download button is clicked, save the image to the user's computer.
var b = document.getElementById('modal_settings_button_download');
b.addEventListener('click', function() {
	console.log('Trying to download...');
	var c = document.getElementById('canvas1');
	// Get a URL for the imahe data
	this.href = c.toDataURL();
	var n = whiteboard.whiteboard_id;
	// Make the user download the data
    this.download = 'whiteboard-' + n + '.png';
});

function SettingsHead() {
	// This object has no constructor
}

// This shouldn't trigger.
SettingsHead.prototype.onModalConfirm = function() {
	whiteboard.modalClose('.modal_settings');
}

// This shouldn't trigger.
SettingsHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_settings');
}

// Tool constructor
function SettingsTool() {
	this.name = 'settings';
	this.shortcut_key = 's';
}

// When the settings button is clicked, open the settings
SettingsTool.prototype.onButtonClick = function() {
	whiteboard.modalOpen('.modal_settings', '.modal_centered');
	return new SettingsHead();
};

whiteboard.makeTool(new SettingsTool());
