import pymongo
# import threading
import collections

connection_url = 'CONNECTION_URL_HERE'
client = pymongo.MongoClient(connection_url)
database = client['whiteboard-dev']
collection = database['whiteboards']

# Rules of the storage queue:
# 1. Operates on the first-in first-out principle.
# 2. All changes to a whiteboard need to be saved.
#    Exception: If the program is terminated, we can forget it.
# 3. The whiteboard does not need to be saved after every change.

def update(bid, data):
    collection.update({'_id': bid}, data, upsert = True)
    
def load(bid):
    return collection.find_one({'_id': bid})

# system_lock = threading.lock()

# queue_master = collections.deque()
# queue_board = collections.defaultdict(lambda : collections.deque)

# def queue_push(board, data):
#     with system_lock:
#         if len(queue_board[board]) == 2:
#             queue_board[board].pop()
#         queue_board[board].append(data)
#         queue_master.append(board)

# def queue_pop():
#     with system_lock:
#         if queue_master.empty():
#             return None, None
#         board = queue_master.popleft()
#         if queue_board[board].empty():
#             return None, None
#         return board, queue_board[board].popleft()

# def request(id):
#     with system_lock:
#         pass

# def save(board, data):
#     with system_lock:
#         collection.update({'_id': board, 'contents': data}, )

# def list_ids():
#     with system_lock:
#         pass

# def deamon_thread():
#     while True:
#         # sleep for 5 seconds
#         board, data = queue_pop()
#         if board and data:
#             save(board, data)
