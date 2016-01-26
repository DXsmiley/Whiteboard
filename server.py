import flask
import json
import collections
import random
import flask.ext.socketio as socketio
import datetime

class Whiteboard:
	def __init__(self):
		self.layers = []
		self.update_time()

	def update_time(self):
		self.last_changed = datetime.datetime.now()

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
		return '{} hours, {} minutes, {} seconds'.format(delta.seconds // 3600, (delta.seconds // 60) % 60, delta.seconds % 60)

whiteboards = collections.defaultdict(lambda : Whiteboard())

app = flask.Flask(__name__)
# app.debug = True

sock = socketio.SocketIO(app)

@app.route('/')
def serve_index():
	return serve_static('index.html')

@app.route('/new')
def server_board_new():
	s = hex(random.randint(0, 2 ** 31))[2:]
	while s in whiteboards:
		s = hex(random.randint(0, 2 ** 31))[2:]
	return flask.redirect('/board/' + s)

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
	data = {
		'data': {
			'board_id': bid,
			'actions': [
				message['data']
			]
		}
	}
	whiteboards[bid].add_action(message['data'])
	socketio.emit('paint', data, broadcast = True)

@sock.on('full image')
def socketio_full_image(message):
	# print('full image', message)
	bid = message['data']['board_id']
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
	whiteboards[bid].undo_action(aid)
	data = {
		'data': {
			'board_id': bid,
			'action_id': aid
		}
	}
	socketio.emit('undo', data, broadcast = True)

if __name__ == '__main__':
	sock.run(app, host = '0.0.0.0', port = 8080)