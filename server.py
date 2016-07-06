import flask
import json
import collections
import random
import flask.ext.socketio as socketio
import time
import edgy
import database
import settings

class keydefaultdict(collections.defaultdict):
	"""collections.defaultdict except the key is passed to the default_factory

	I got this off Stack Overflow: http://stackoverflow.com/a/2912455/2002307
	"""
	def __missing__(self, key):
		if self.default_factory is None:
			raise KeyError(key)
		else:
			ret = self[key] = self.default_factory(key)
		return ret

def make_humane_gibberish(length):
	"""Generate a meaningless but human-friendly string.
	
	Characters are chosen so that no two characters are alike.
	Easily confused characters, such as '1' and 'l' are also excluded.
	"""
	result = ''
	for i in range(length):
		result += random.choice('ACEFHJKNPQRTVXY34869')
	return result

def time_current():
	"""Returns the number of second since the epoch."""
	return int(time.time())

def time_breakdown(t):
	"""Takes time as seconds-since epoch and breaks it down into human-friendly values."""
	t = max(0, t)
	return {
		'seconds': t % 60,
		'minutes': (t // 60) % 60,
		'hours': (t // 3600) % 24,
		'days': t // 86400
	}

class Whiteboard:
	"""Object representing a single whiteboard.

	This interfaces with the database on the backend.

		has_loaded :: whether the content have been loaded
		layers :: the list of actions that have been performed on the whiteboard
		timestamp :: the time at which the whiteboard was last modified
		permissions :: string, either 'open', 'presentation', or 'private'
		key :: string used to identify who has access to the whiteboard
		owner_key :: string used to identify who owns (created) the whiteboard
	"""
	def __init__(self, name):
		"""Initialise a whiteboard object

		Initially, the contents of the whiteboard has not been loaded.
		"""
		self.has_loaded = False
		self.layers = []
		self.timestamp = 0
		self.permissions = 'open'
		self.key = ''
		self.owner_key = ''
		self.name = name

	def ensure_loaded(self):
		"""Load the whiteboard's contents if they haven't been already"""
		if not self.has_loaded:
			self.load_everything()
			self.save_everything()

	def load_everything(self):
		"""Load all the data from the database"""
		data = database.load(self.name)
		if data:
			# Using get will allow backwards compatibility in the future
			self.key = data.get('key', '')
			self.owner_key = data.get('owner_key', '')
			self.layers = data.get('layers', [])
			self.timestamp = data.get('timestamp', time_current())
		self.has_loaded = True

	def save_everything(self):
		"""Save all the data to the database"""
		self.ensure_loaded()
		payload = {
			'layers': self.layers,
			'key': self.key,
			'owner_key': self.owner_key,
			'timestamp': self.timestamp
		}
		database.rewrite(self.name, payload)

	def update_time(self):
		"""Change the modification timestamp to the current time"""
		self.timestamp = time_current()

	def full_image(self):
		"""Returns a copy of the whiteboard contents, for sending to the cient"""
		self.ensure_loaded()
		self.update_time()
		return self.layers[:]

	def add_action(self, action):
		"""Add a paint action to the whiteboard"""
		self.ensure_loaded()
		self.update_time()
		self.layers.append(action)
		database.action_push(self.name, action, self.timestamp)

	def undo_action(self, action):
		"""Remove a paint action from the whiteboard"""
		self.ensure_loaded()
		self.update_time()
		self.layers = [i for i in self.layers if i['action_id'] != action]
		database.action_remove(self.name, action, self.timestamp)

	def make_protected(self):
		"""Set the whiteboard to be 'protected'

		Will regenerate keys even if the whiteboard is already protected"""
		self.ensure_loaded()
		self.permissions = 'protected'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)
		self.save_everything()

	def make_private(self):
		"""Set the whiteboard to be 'private'

		Will regenerate keys even if the whiteboard is already private"""
		self.ensure_loaded()
		self.permissions = 'private'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)
		self.save_everything()

	def unlock(self):
		"""Sets the whiteboard to be publically accessible (by those with the link)"""
		self.ensure_loaded()
		self.permissions = 'open'
		self.save_everything()

	def may_view(self, key):
		"""Checks if someone with the given key may view the whiteboard"""
		self.ensure_loaded()
		return self.permissions in ['open', 'protected'] or key in [self.key, self.owner_key]

	def may_edit(self, key):
		"""Checks if someone with the given key may edit the whiteboard"""
		self.ensure_loaded()
		return self.permissions == 'open' or key in [self.key, self.owner_key]

# Create a dictioary of whiteboards and load the whiteboard metadata

whiteboards = keydefaultdict(lambda name: Whiteboard(name))

for i in database.load_meta():
	whiteboards[i['name']].timestamp = i['timestamp']

# Create the flask server and the socket.io handler

app = flask.Flask(__name__)
app.debug = True

sock = socketio.SocketIO(app)

def make_board_id():
	"""Generates an unused board id"""
	attempts = 0
	board_id = make_humane_gibberish(4)
	# Every time a clash occurs, increase the length of the ID by one
	# in order to avoid problems with the birthday paradox.
	# Initially having the key to be small ensures that links remain human readable.
	while board_id in whiteboards:
		board_id = make_humane_gibberish(attempts + 4)
		attempts += 1
	return board_id

def make_board(permissions = 'open', board_id = None):
	"""Creates a new board with specifc permissions"""
	board_id = board_id or make_board_id()
	whiteboards[board_id]
	if permissions == 'protected':
		whiteboards[board_id].make_protected()
	if permissions == 'private':
		whiteboards[board_id].make_private()
	return (board_id, whiteboards[board_id].owner_key)

# Set up routing for the information pages (home, about, etc...)

@app.route('/')
def serve_index():
	return flask.render_template('index.tpl')

@app.route('/about')
def serve_about():
	return flask.render_template('about.tpl')

# URLs that create new whiteboards. They create a new whiteboard and
# then automatically redirect the user there.

@app.route('/docs')
def serve_docs():
	return flask.render_template('docs.tpl')

@app.route('/legal')
def serve_legal():
	return flask.render_template('legal.tpl')

@app.route('/new')
def server_board_new():
	board_id, key = make_board()
	return flask.redirect('/board/' + board_id)

@app.route('/new/protected')
def server_board_new_protected():
	board_id, key = make_board(permissions = 'protected')
	response = flask.make_response(flask.redirect('/board/' + board_id))
	response.set_cookie('key_' + board_id, key)
	return response

@app.route('/new/private')
def server_board_new_private():
	board_id, key = make_board(permissions = 'private')
	response = flask.make_response(flask.redirect('/board/' + board_id))
	response.set_cookie('key_' + board_id, key)
	return response

# Serves up a list of existant whiteboards.
# Used for debugging purposes only.
# TODO: Add a password to this page, don't let normal users see it.

@app.route('/listing')
def serve_listing():
	boards = []
	for i in whiteboards:
		time_diff = time_current() - whiteboards[i].timestamp
		timeparts = time_breakdown(time_diff)
		rec_str = '{days} days, {hours} hours, {minutes} minutes, {seconds} seconds'.format(**timeparts)
		boards.append({
			'name': i,
			'recency': 	rec_str
		})
	return flask.render_template('listing.tpl', boards = boards)

# Serve the board
# Both '/board/x' and '/b/x' are supported for convinience

@app.route('/board/<board_id>')
@app.route('/b/<board_id>')
def serve_board(board_id):
	board_id = board_id.upper()
	board = whiteboards[board_id]
	key = flask.request.cookies.get('key_' + board_id)
	if board.may_view(key):
		show_controls = board.may_edit(key)
		return flask.render_template(
			'whiteboard.tpl',
			board_id = board_id,
			show_controls = show_controls,
			permissions = board.permissions,
			feedback_form = settings.get('feedback_form')
		)
	else:
		flask.abort(403)

# Serve static files

@app.route('/static/<path:path>')
def serve_static(path):
	print('Serving static: ', path)
	return flask.send_from_directory('static', path)

# Load the paint action schema into a constant.

def load_schema(name):
	text = open('schemas/' + name + '.json').read()
	return json.loads(text)

SCHEMA_PAINT = load_schema('paint')

# Handle incomming paint event.

@sock.on('paint')
def socketio_paint(message):
	# print('paint', message)
	# Ensure the paint action is valid
	if edgy.check(SCHEMA_PAINT, message):
		bid = message['board_id'].upper()
		key = message['key']
		board = whiteboards[bid]
		# Ensure the user has the correct permissions
		if board.may_edit(key):
			# Add the action to the whiteboard
			board.add_action(message)
			# Transmit the action to all other clients
			data = {
				'board_id': bid,
				'actions': [
					message
				]
			}
			socketio.emit('paint', data, broadcast = True, room = bid)
	else:
		print('A paint action failed')
		print(message)

# Fired when the user joins the whiteboard.

@sock.on('full image')
def socketio_full_image(message):
	# print('full image', message)
	bid = message['board_id'].upper()
	key = message['key']
	board = whiteboards[bid]
	# Ensure the user may see this board
	if board.may_view(key):
		socketio.join_room(bid)
		data = {
			'board_id': bid,
			'actions': board.full_image()
		}
		socketio.emit('paint', data)

# Fired when a user attempts to undo an action

@sock.on('undo')
def socketio_undo(message):
	bid = message['board_id'].upper()
	aid = message['action_id']
	key = message['key']
	board = whiteboards[bid]
	# Ensure the user has permission to edit the board
	if board.may_edit(key):
		# Remove the action from the board
		board.undo_action(aid)
		# Tell other clients the action has been undone
		data = {
			'board_id': bid,
			'action_id': aid
		}
		socketio.emit('undo', data, broadcast = True, room = bid)

# Fired when a user attmpts to unlock a whiteboard

@sock.on('unlock')
def socketio_unlock(message):
	bid = message['board_id'].upper()
	key = message['key']
	board = whiteboards[bid]
	# Ensure the user has permission to do so
	if board.may_edit(key):
		board.unlock()
		# Tells the other client that the board has been unlocked
		# this will cause the browsers to refresh the page
		socketio.emit('refresh', broadcast = True, room = bid)

# Run the server

if __name__ == '__main__':
	port = int(settings.get('port'))
	sock.run(app, host = '0.0.0.0', port = port)
