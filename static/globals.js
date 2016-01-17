var whiteboard_id = 'unknown';
var socket = undefined;
var tool_heads = [null, null, null, null, null]; // support up to five fingers! not.
var tools_by_name = {};
var context_picture = document.getElementById('canvas1').getContext('2d'); // bottom layer
var context_preview = document.getElementById('canvas2').getContext('2d'); // top layer
var active_tool = null;
var global_colour = null;
var tools = {};

function setWhiteboardId(wid) {
	whiteboard_id = wid;
}

// var tools = {
// 	pencil: tool_pencil,
// 	eraser: tool_eraser,
// 	text: tool_text,
// 	clear: tool_clear,
// 	image: tool_image
// };

function makeTool(tool) {
	tools[tool.name] = tool;
}

function nullFunction() {
	// a function that does nothing
}