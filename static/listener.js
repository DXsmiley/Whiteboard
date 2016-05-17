modules.create('listener', function () {

	var whiteboard = modules.require('whiteboard');

	function receiveMessage(event) {
		console.log('[Whiteboard API Listener] Received message:', event.origin, event.data);
		if (event.data.type === 'event') {
			if (event.data.event == 'startup') {
				event.source.postMessage({'type': 'event', 'event': 'breathing'}, event.origin);
			} else {
				console.error('[Whiteboard API Listener] Unknown event', event.data.event);
			}
		} else if (event.data.type === 'action') {
			if (event.data.action === 'clear') {
				whiteboard.sendPaintEvent('clear', 0);
			} else if (event.data.action === 'select tool') {
				whiteboard.toolSetActive(event.data.tool);
			} else if (event.data.action === 'toolbar visibility') {
				whiteboard.toolbarVisibility(event.data.visible);
			} else if (event.data.action === 'allow panning') {
				whiteboard.allowPanning(event.data.allow);
			} else {
				console.error('[Whiteboard API Listener] Unknown action:', event.data.action);
			}
		} else {
			console.error('[Whiteboard API Listener] Unknown event.data.type:', event.data.type);
		}
	}

	window.addEventListener("message", receiveMessage, false);

});
