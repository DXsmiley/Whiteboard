(function() {

	function ClearHead() {
		// a dataless prototype
	};

	ClearHead.prototype.onMove = nullFunction;
	ClearHead.prototype.onRelease = nullFunction;

	ClearHead.prototype.onModalConfirm = function() {
		sendPaintEvent('clear', 0);
		modalClose('.modal_clear');
	};

	ClearHead.prototype.onModalCancel = function() {
		modalClose('.modal_clear');
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