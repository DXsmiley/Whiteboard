import pymongo
import collections
import sys
import settings

enable = settings.get('db_enable')

if enable:
	client = pymongo.MongoClient(settings.get('db_login'))
	database = client[settings.get('db_name')]
	whiteboards = database['whiteboards']
	feedback = database['feedback']
else:
	print('Warning: Database not enabled')

def action_push(bid, action, time):
	if enable:
		whiteboards.update({'_id': bid}, {'$push': {'layers': action}, '$set': {'timestamp': time}}, upsert = True)

def action_remove(bid, action_id, time):
	if enable:
		whiteboards.update({'_id': bid}, {'$pull': {'layers': {'action_id': action_id}}, '$set': {'timestamp': time}}, upsert = True)

def rewrite(bid, data):
	if enable:
		whiteboards.update({'_id': bid}, data, upsert = True)

def load(bid):
	if enable:
		return whiteboards.find_one({'_id': bid})

def load_meta():
	results = []
	if enable:
		for i in whiteboards.find({}, {'_id': True, 'timestamp': True}):
			results.append({
				'name': i['_id'],
				'timestamp': i.get('timestamp', 0)
			})
	return results

def feedback_post(message):
	if enable:
		feedback.insert({'message': message})

def feedback_delete(feedback_id):
	if enable:
		feeedback.remove({'_id': feedback_id})

def feedback_list():
	if enable:
		for i in feedback.find():
			yield {
				'id': i['_id'],
				'message': i['message']
			}
