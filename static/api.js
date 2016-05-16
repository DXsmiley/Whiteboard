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

	API.prototype.receive = function(event) {
		console.log('API interface received message:', event.origin, event.data);
	};

	API.prototype.startConversation = function() {
		this.iframe.postMessage({'type': 'event', 'event': 'startup'}, '*');
	};

	API.prototype.clear = function() {
		this.iframe.postMessage({'type': 'action', 'action': 'clear'}, '*');
	};

	API.prototype.setTool = function(tool_name) {
		this.iframe.postMessage({'type': 'action', 'action': 'set tool', 'tool': tool_name}, '*');
	};

	return API;

})();
