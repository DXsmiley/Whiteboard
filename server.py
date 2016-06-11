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
	def __init__(self, name):
		self.has_loaded = False
		self.layers = []
		self.timestamp = 0
		self.permissions = 'open'
		self.key = ''
		self.owner_key = ''
		self.name = name

	def ensure_loaded(self):
		if not self.has_loaded:
			self.load_everything()
			self.save_everything()

	def load_everything(self):
		data = database.load(self.name)
		if data:
			# Using get will allow backwards compatibility in the future
			self.key = data.get('key', '')
			self.owner_key = data.get('owner_key', '')
			self.layers = data.get('layers', [])
			self.timestamp = data.get('timestamp', time_current())
		self.has_loaded = True

	def save_everything(self):
		self.ensure_loaded()
		payload = {
			'layers': self.layers,
			'key': self.key,
			'owner_key': self.owner_key,
			'timestamp': self.timestamp
		}
		database.rewrite(self.name, payload)

	def update_time(self):
		self.timestamp = time_current()

	def full_image(self):
		self.ensure_loaded()
		self.update_time()
		return self.layers[:]

	def add_action(self, action):
		self.ensure_loaded()
		self.update_time()
		self.layers.append(action)
		database.action_push(self.name, action, self.timestamp)

	def undo_action(self, action):
		self.ensure_loaded()
		self.update_time()
		self.layers = [i for i in self.layers if i['action_id'] != action]
		database.action_remove(self.name, action, self.timestamp)

	def make_protected(self):
		self.ensure_loaded()
		self.permissions = 'protected'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)
		self.save_everything()

	def make_private(self):
		self.ensure_loaded()
		self.permissions = 'private'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)
		self.save_everything()

	def unlock(self):
		self.ensure_loaded()
		self.permissions = 'open'
		self.save_everything()

	def may_view(self, key):
		self.ensure_loaded()
		return self.permissions in ['open', 'protected'] or key in [self.key, self.owner_key]

	def may_edit(self, key):
		self.ensure_loaded()
		return self.permissions == 'open' or key in [self.key, self.owner_key]

whiteboards = keydefaultdict(lambda name: Whiteboard(name))

for i in database.load_meta():
	# Accessing the item in the dictionary will create the board.
	whiteboards[i['name']].timestamp = i['timestamp']

app = flask.Flask(__name__)
app.debug = True

sock = socketio.SocketIO(app)

def make_board_id():
	attempts = 0
	board_id = make_humane_gibberish(4)
	while board_id in whiteboards:
		board_id = make_humane_gibberish(attempts + 4)
		attempts += 1
	return board_id

def make_board(permissions = 'open', board_id = None):
	board_id = board_id or make_board_id()
	whiteboards[board_id]
	if permissions == 'protected':
		whiteboards[board_id].make_protected()
	if permissions == 'private':
		whiteboards[board_id].make_private()
	return (board_id, whiteboards[board_id].owner_key)

@app.route('/')
def serve_index():
	return flask.render_template('index.tpl')

@app.route('/about')
def serve_about():
	return flask.render_template('about.tpl')

@app.route('/ninjas')
def serve_ninjas():
	return flask.render_template('ninjas.tpl')

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
			permissions = board.permissions
		)
	else:
		flask.abort(403)

@app.route('/static/<path:path>')
def serve_static(path):
	print('Serving static: ', path)
	return flask.send_from_directory('static', path)

def load_schema(name):
	text = open('schemas/' + name + '.json').read()
	return json.loads(text)

SCHEMA_PAINT = load_schema('paint')

@sock.on('paint')
def socketio_paint(message):
	# print('paint', message)
	if edgy.check(SCHEMA_PAINT, message):
		bid = message['board_id'].upper()
		key = message['key']
		board = whiteboards[bid]
		if board.may_edit(key):
			data = {
				'board_id': bid,
				'actions': [
					message
				]
			}
			board.add_action(message)
			socketio.emit('paint', data, broadcast = True, room = bid)
	else:
		print('A paint action failed')
		print(message)

@sock.on('full image')
def socketio_full_image(message):
	# print('full image', message)
	bid = message['board_id'].upper()
	key = message['key']
	board = whiteboards[bid]
	if board.may_view(key):
		socketio.join_room(bid)
		data = {
			'board_id': bid,
			'actions': board.full_image()
		}
		socketio.emit('paint', data)

@sock.on('undo')
def socketio_undo(message):
	bid = message['board_id'].upper()
	aid = message['action_id']
	key = message['key']
	board = whiteboards[bid]
	if board.may_edit(key):
		board.undo_action(aid)
		data = {
			'board_id': bid,
			'action_id': aid
		}
		socketio.emit('undo', data, broadcast = True, room = bid)

@sock.on('unlock')
def socketio_unlock(message):
	bid = message['board_id'].upper()
	key = message['key']
	board = whiteboards[bid]
	if board.may_edit(key):
		board.unlock()
		socketio.emit('refresh', broadcast = True, room = bid)

if __name__ == '__main__':
	port = int(settings.get('port'))
	sock.run(app, host = '0.0.0.0', port = port)
