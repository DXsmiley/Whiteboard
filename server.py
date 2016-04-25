import flask
import json
import collections
import random
import flask.ext.socketio as socketio
import datetime
import edgy

def make_humane_gibberish(length):
	"""Generate a meaningless but human-friendly string.
	
	Characters are chosen so that no two characters are alike.
	Easily confused characters, such as '1' and 'l' are also excluded.
	"""
	result = ''
	for i in range(6):
		result += random.choice('ABCDEFHJKNPQRSTVXYZ2345869')
	return result

class Whiteboard:
	def __init__(self):
		self.layers = []
		self.last_changed = datetime.datetime.now()
		self.last_saved = datetime.datetime.now()
		self.permissions = 'open'
		self.key = ''
		self.owner_key = ''

	def update_time(self):
		self.last_changed = datetime.datetime.now()

	def update_save_time(self):
		self.last_changed = datetime.datetime.now()
		self.last_saved = datetime.datetime.now()

	def changed_since_save(self):
		return self.last_changed != self.last_saved

	def full_image(self):
		self.update_time()
		return self.layers[:]

	def add_action(self, action):
		self.update_time()
		self.layers.append(action)

	def undo_action(self, action):
		self.update_time()
		self.layers = [i for i in self.layers if i['action_id'] != action]

	def recency_formatted(self):
		delta = datetime.datetime.now() - self.last_changed
		hours = delta.seconds // 3600
		minutes = (delta.seconds // 60) % 60
		seconds = delta.seconds % 60
		return '{} hours, {} minutes, {} seconds'.format(hours, minutes, seconds)

	def make_protected(self):
		self.permissions = 'protected'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)

	def make_private(self):
		self.permissions = 'private'
		self.key = make_humane_gibberish(6)
		self.owner_key = make_humane_gibberish(30)

	def unlock(self):
		self.permissions = 'open'

	def may_view(self, key):
		return self.permissions in ['open', 'protected'] or key in [self.key, self.owner_key]

	def may_edit(self, key):
		return self.permissions == 'open' or key in [self.key, self.owner_key]

	def jsonise(self):
		return {
			'layers': self.layers[:],
			'last_changed': {
				'year': self.last_changed.year,
				'month': self.last_changed.month,
				'day': self.last_changed.day,
				'hour': self.last_changed.hour,
				'minute': self.last_changed.minute,
				'second': self.last_changed.second
			}
		}

whiteboards = collections.defaultdict(lambda : Whiteboard())

app = flask.Flask(__name__)
app.debug = True

sock = socketio.SocketIO(app)

def make_board(permissions = 'open'):
	attempts = 0
	board_id = make_humane_gibberish(4)
	while board_id in whiteboards:
		board_id = make_humane_gibberish(attempts + 4)
		attempts += 1
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
		boards.append({
			'name': i,
			'recency': 	whiteboards[i].recency_formatted()
		})
	return flask.render_template('listing.tpl', boards = boards)

@app.route('/board/<board_id>')
@app.route('/b/<board_id>')
def serve_board(board_id):
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
	if edgy.check(SCHEMA_PAINT, message['data'], trace = True):
		print('Yeah!')
		bid = message['data']['board_id']
		key = message['data']['key']
		board = whiteboards[bid]
		if board.may_edit(key):
			data = {
				'data': {
					'board_id': bid,
					'actions': [
						message['data']
					]
				}
			}
			board.add_action(message['data'])
			socketio.emit('paint', data, broadcast = True, room = bid)
	else:
		print('Noo!')

@sock.on('full image')
def socketio_full_image(message):
	# print('full image', message)
	bid = message['data']['board_id']
	key = message['data']['key']
	board = whiteboards[bid]
	if board.may_view(key):
		socketio.join_room(bid)
		data = {
			'data': {
				'board_id': bid,
				'actions': board.full_image()
			}
		}
		socketio.emit('paint', data)

@sock.on('undo')
def socketio_undo(message):
	bid = message['data']['board_id']
	aid = message['data']['action_id']
	key = message['data']['key']
	board = whiteboards[bid]
	if board.may_edit(key):
		board.undo_action(aid)
		data = {
			'data': {
				'board_id': bid,
				'action_id': aid
			}
		}
		socketio.emit('undo', data, broadcast = True, room = bid)

@sock.on('unlock')
def socketio_unlock(message):
	bid = message['data']['board_id']
	key = message['data']['key']
	board = whiteboards[bid]
	if board.may_edit(key):
		board.unlock()
		socketio.emit('refresh', broadcast = True, room = bid)

if __name__ == '__main__':
	sock.run(app, host = '0.0.0.0', port = 8080)