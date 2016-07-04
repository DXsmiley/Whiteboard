function UnlockTool() {
	this.name = 'unlock';
}

// When the button is clicked, ask the user if they want to unlock the board.
UnlockTool.prototype.onButtonClick = function() {
	var res = window.confirm("Unlock the whiteboard? Anyone will be able to view and access draw on it.");
	if (res) {
		whiteboard.sendUnlockEvent();
	}
	// var key = window.prompt("Enter whiteboard key", "");
	// if (key && key !== null) {
	// 	Cookies.set("key_" + whiteboard.whiteboard_id, key);
	// }
	return false;
};

whiteboard.makeTool(new UnlockTool());
