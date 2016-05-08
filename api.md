# Whiteboard API

## Embedding a Whiteboard

Simplest option. Has no customisation, probably can't support secret rooms and things.

	<iframe src="whtbrd.herokuapp.com/easy_embed/room_id?features=abcdef"></iframe>

Option with more flexibility.

	<iframe src="whtbrd.herokuapp.com/embed></iframe>
	<script type="text/javascript" src=".../embed_me.js"></script>
	<script>
		api = new BoardApi();
		api.add('pencil', {'scale': 3, 'style': 'straight'});
		api.add('eraser', {'scale': 26, 'style': 'straight'});
		api.add('text');
		api.add('image');
		api.add_colour('blue');
		api.add_colour('orange');
		api.add_colour('black');
		api.add('clear', {'confirm': False});
		api.establish();
	</script>

## Writing Plugins

### Dependency Management

All plugins should utilise `require.js`.

### The Whiteboard Object

I think the panning object should also be a plugin...

Someone might want to change it to a particular tool in the future, so there'll
be a seperate set of hooks to deal with left and right mouse clicks.

There'll also be a set of functions to create *global* hooks, that will trigger
when something happens regardless of the state of the modal.

Also, hooks for touch screen events :(

Also, I should add a THIRD canvas layer for debugging output. That'll be pretty cool.
Along with a number of keyboard shortcuts to toggle it and stuff.

#### whiteboard.buttonCreate('image', 'action')

Creates a button on the main toolbar, with specified image and callback.
Returns the button's DOM object.

#### whiteboard.modalCreate(name)

Creates a modal, returning the DOM object which can then be populated.
Also returns the name of the modal.
In theory, each modal should be unique, but some plugins may utilise the modals
created by other plugins. In this case, we need a way to minimise duplicate code.

#### whiteboard.modalDisplay(modal)

Closes all modals, then opens to specified one.

#### whiteboard.toolCreate(tool_object)

Creates a tool.

#### whiteboard.toolSelect(name)

Selects the tool.

#### whiteboard.setUserParameter(name, value)

Used to change 'user parameters', such as the selected colour, pen size, etc.

#### whiteboard.getUserParameter(name)

Pretty simple.

#### whiteboard.

### Tool Objects

#### tool.activate()

Tells the tool that it has been selected.

#### tool.used()

Tells the tool that it has been used. This should return a tool_head object of some sort.

### Head Objects

*Note to self*: I need to seperate the modal-action interface from the canvas-action interface.
Also, more hooks to trigger events on keybord events would be great.

#### head.mouseMoved(position)

Can be utilised by the pencil.

#### head.mouseClicked(position)

When the mouse is clicked (in the modal)

#### head.mouseReleased(position)

When the mouse is released (anywhere...)
