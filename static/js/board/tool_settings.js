$('#modal_settings_button_clear').click(function() {
	whiteboard.modalClose('.modal_settings');
	whiteboard.sendPaintEvent('clear', 0);
});

$('#modal_settings_button_cancel').click(function() {
	whiteboard.modalClose('.modal_settings');
});

var b = document.getElementById('modal_settings_button_download');
b.addEventListener('click', function() {
	console.log('Trying to download...');
	var c = document.getElementById('canvas1');
	this.href = c.toDataURL();
	var n = whiteboard.whiteboard_id;
    this.download = 'whiteboard-' + n + '.png';
});

function SettingsHead() {
	// This object has no constructor
}

SettingsHead.prototype.onModalConfirm = function() {
	whiteboard.modalClose('.modal_settings');
}

SettingsHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_settings');
}

function SettingsTool() {
	this.name = 'settings';
	this.shortcut_key = 's';
}

SettingsTool.prototype.onButtonClick = function() {
	whiteboard.modalOpen('.modal_settings', '.modal_centered');
	return new SettingsHead();
};

whiteboard.makeTool(new SettingsTool());
