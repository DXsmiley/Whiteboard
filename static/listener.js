modules.create('listener', function () {

	var whiteboard = modules.require('whiteboard');

	console.log('The whiteboard:', whiteboard);

	function receiveMessage(event) {
		console.log('Listener received message:', event.origin, event.data);
		if (event.data.type === 'event') {
			if (event.data.event == 'startup') {
				event.source.postMessage({'type': 'event', 'event': 'breathing'}, event.origin);
			} else {
				console.log('Unknown event', event.data.event);
			}
		} else if (event.data.type === 'action') {
			if (event.data.action === 'clear') {
				console.log('Cleaing whiteboard...');
				whiteboard.sendPaintEvent('clear', 0);
			} else if (event.data.action === 'select tool') {
				whiteboard.toolSetActive(event.data.tool);
			} else {
				console.log('Unknown action:', event.data.action);
			}
		} else {
			console.log('Unknown event.data.type:', event.data.type);
		}
	}

	window.addEventListener("message", receiveMessage, false);

});
