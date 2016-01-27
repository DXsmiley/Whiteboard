import flask
import json
import collections
import random
import flask.ext.socketio as socketio
import datetime
import threading
import queue
import time

# Apply a lock to a method in a class.
def locked_method(func):
	def internal(instance, *args, **kwargs):
		# Make sure the object has a lock
		if not hasattr(instance, '_object_lock_'):
			setattr(instance, '_object_lock_', threading.RLock())
		instance._object_lock_.acquire() # Lock the object
		result = func(instance, *args, **kwargs) # Call the function
		instance._object_lock_.release() # Unlock the object
		return result
	return internal

class Whiteboard:
	def __init__(self):
		self.layers = []
		self.last_changed = datetime.datetime.now()
		self.last_saved = datetime.datetime.now()

	@locked_method
	def update_time(self):
		self.last_changed = datetime.datetime.now()

	@locked_method
	def update_save_time(self):
		self.last_changed = datetime.datetime.now()
		self.last_saved = datetime.datetime.now()

	@locked_method
	def changed_since_save(self):
		return self.last_changed != self.last_saved

	@locked_method
	def full_image(self):
		self.update_time()
		return self.layers[:]

	@locked_method
	def add_action(self, action):
		self.update_time()
		self.layers.append(action)

	@locked_method
	def undo_action(self, action):
		self.update_time()
		self.layers = [i for i in self.layers if i['action_id'] != action]

	@locked_method
	def recency_formatted(self):
		delta = datetime.datetime.now() - self.last_changed
		return '{} hours, {} minutes, {} seconds'.format(delta.seconds // 3600, (delta.seconds // 60) % 60, delta.seconds % 60)

	@locked_method
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

storage_queue = queue.Queue()

def storage_daemon():
	print('Storage daemon started')
	while True:
		if storage_queue.empty():
			time.sleep(5)
		else:
			name = storage_queue.get()
			print('Dequeue', name)
			board = whiteboards[name]
			if board.changed_since_save():
				board.update_save_time()
				data = board.jsonise()
				try:
					with open('./store/' + name + '.json', 'w') as f:
						f.write(json.dumps(data))
					print('Saved', name)
				except Exception as e:
					print('Save failed', name)
					print(e)

def queue_board_store(board_name):
	storage_queue.put(board_name)
	print('Enqueue', board_name)

app = flask.Flask(__name__)
app.debug = True

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
	queue_board_store(bid)
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
	queue_board_store(bid)
	socketio.emit('undo', data, broadcast = True)

if __name__ == '__main__':
	storage_thread_object = threading.Thread(target = storage_daemon)
	storage_thread_object.daemon = True
	storage_thread_object.start()
	sock.run(app, host = '0.0.0.0', port = 8080)