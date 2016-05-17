WhiteboardAPI = (function() {

	function API(frame_id, board_id) {

		this.iframe = document.getElementById(frame_id).contentWindow;
		this.board_id = board_id;

		var api_obj = this;

		this.iframe.onload = function() { 
			api_obj.startConversation();
		};

		window.addEventListener("message", (event) => (api_obj.receive(event)), false);

		this.startConversation();

	}

	API.prototype.post = function(data) {
		this.iframe.postMessage(data, '*');
	};

	API.prototype.receive = function(event) {
		console.log('API interface received message:', event.origin, event.data);
	};

	API.prototype.startConversation = function() {
		this.post({
			'type': 'event',
			'event': 'startup'
		});
	};

	API.prototype.clear = function() {
		this.post({
			'type': 'action',
			'action': 'clear'
		});
	};

	API.prototype.setTool = function(tool_name) {
		this.post({
			'type': 'action',
			'action': 'set tool',
			'tool': tool_name
		});
	};

	API.prototype.setColour = function(colour) {
		this.post({
			'type': 'action',
			'action': 'set colour',
			'colour': colour
		})
	};

	API.prototype.toolbarVisibility = function(visible) {
		this.post({
			'type': 'action',
			'action': 'toolbar visibility',
			'visible': visible
		});
	};

	API.prototype.allowPanning = function(allow) {
		this.post({
			'type': 'action',
			'action': 'allow panning',
			'allow': allow
		})
	};

	return API;

})();
