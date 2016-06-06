import pymongo
import collections
import sys

connection_url = sys.argv[2]
client = pymongo.MongoClient(connection_url)
database = client[sys.argv[3]]
collection = database['whiteboards']

def action_push(bid, action, time):
    collection.update({'_id': bid}, {'$push': {'layers': action}, '$set': {'timestamp': time}}, upsert = True)

def action_remove(bid, action_id, time):
    collection.update({'_id': bid}, {'$pull': {'layers': {'action_id': action_id}}, '$set': {'timestamp': time}}, upsert = True)

def rewrite(bid, data):
    collection.update({'_id': bid}, data, upsert = True)
    
def load(bid):
    return collection.find_one({'_id': bid})

def load_meta():
    results = []
    for i in collection.find({}, {'_id': True, 'timestamp': True}):
        results.append({
            'name': i['_id'],
            'timestamp': i.get('timestamp', 0)
        })
    return results
