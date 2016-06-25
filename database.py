import pymongo
import collections
import sys
import settings

enable = settings.get('db_enable')

if enable:
	client = pymongo.MongoClient(settings.get('db_login'))
	database = client[settings.get('db_name')]
	collection = database['whiteboards']
else:
	print('Warning: Database not enabled')

def action_push(bid, action, time):
	if enable:
		collection.update({'_id': bid}, {'$push': {'layers': action}, '$set': {'timestamp': time}}, upsert = True)

def action_remove(bid, action_id, time):
	if enable:
		collection.update({'_id': bid}, {'$pull': {'layers': {'action_id': action_id}}, '$set': {'timestamp': time}}, upsert = True)

def rewrite(bid, data):
	if enable:
		collection.update({'_id': bid}, data, upsert = True)

def load(bid):
	if enable:
		return collection.find_one({'_id': bid})

def load_meta():
	results = []
	if enable:
		for i in collection.find({}, {'_id': True, 'timestamp': True}):
			results.append({
				'name': i['_id'],
				'timestamp': i.get('timestamp', 0)
			})
	return results
