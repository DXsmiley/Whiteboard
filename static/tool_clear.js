(function() {

	function ClearHead() {
		// a dataless prototype
	};

	ClearHead.prototype.onMove = nullFunction;
	ClearHead.prototype.onRelease = function() nullFunction;

	ClearHead.prototype.onModalConfirm = function() {
		sendPaintEvent('clear', 0);
		modalClose();
	};

	ClearHead.prototype.onModalCancel = function() {
		modalClose();
	};

	makeTool({
		name: 'clear',
		buttonImage: 'clear.png',
		onButtonClick: function() {
			// sendPaintEvent('clear', []);
			modalOpen('.modal_clear');
			// This is just a button.
			return new ClearHead();
		},
		drawFull: function(data) {
			drawClear(context_picture);
		}

	});

})();