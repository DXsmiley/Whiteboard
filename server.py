import flask
import json
import collections
import random
import flask.ext.socketio as socketio
import datetime

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
		self.protected = False
		self.key = ''

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
		self.protected = True
		self.key = make_humane_gibberish(6)

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

def make_board(protected = False):
	attempts = 0
	board_id = make_humane_gibberish(4)
	while board_id in whiteboards:
		board_id = make_humane_gibberish(attempts + 4)
		attempts += 1
	if protected:
		whiteboards[board_id].make_protected()
	return (board_id, whiteboards[board_id].key)

@app.route('/')
def serve_index():
	return serve_static('index.html')

@app.route('/new')
def server_board_new():
	board_id, key = make_board()
	return flask.redirect('/board/' + board_id)

@app.route('/new/protected')
def server_board_new_protected():
	board_id, key = make_board(protected = True)
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
def serve_board(board_id):
	return flask.render_template('whiteboard.tpl', board_id = board_id)

@app.route('/static/<path:path>')
def serve_static(path):
	print('Serving static: ', path)
	return flask.send_from_directory('static', path)

@sock.on('paint')
def socketio_paint(message):
	# print('paint', message)
	bid = message['data']['board_id']
	key = message['data']['key']
	board = whiteboards[bid]
	if not board.protected or board.key == key:
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

@sock.on('full image')
def socketio_full_image(message):
	# print('full image', message)
	bid = message['data']['board_id']
	socketio.join_room(bid)
	data = {
		'data': {
			'board_id': bid,
			'actions': whiteboards[bid].full_image()
		}
	}
	socketio.emit('paint', data)

@sock.on('undo')
def socketio_undo(message):
	bid = message['data']['board_id']
	aid = message['data']['action_id']
	board = whiteboards[bid]
	if not board.protected or board.key == key:
		board.undo_action(aid)
		data = {
			'data': {
				'board_id': bid,
				'action_id': aid
			}
		}
		socketio.emit('undo', data, broadcast = True, room = bid)

if __name__ == '__main__':
	sock.run(app, host = '0.0.0.0', port = 8080)