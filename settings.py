"""Used to load program settings.

Settings are accessed by name, using the `get` function.
All the internals are abstracted away for convenience.

There are a few features which can be used to access
settings from other places.

env:VAR
	Accesses the environment variable VAR.

param:NUM
	Accesses command line parameter NUM

Example settings file

{
	"port": "param:2",
	"host": "param:1",
	"database_login": "env:DB_LOGIN",
	"secret": "48697304624530"
}

"""

import sys
import json
import os

LOADFROM = 'settings.json'

settings = None

def ensure_loaded():
	"""Loads the settings from the file if they are not already loaded.

	This function is called by the `get` function, so it does not to be called manually.
	"""
	global settings
	if settings is None:
		settings = {}
		with open(LOADFROM) as thefile:
			data = json.loads(thefile.read())
			for key, value in data.items():
				settings[key] = value
				if type(value) is str:
					if value.startswith('env:'):
						# Load from environment variable
						settings[key] = os.environ[value[4:]]
					elif value.startswith('param:'):
						# Load from command-line parameter
						inx = ind(value[6:])
					elif value.startswith(':'):
						# Command escaping
						settings[key] = value[1:]

def get(name):
	"""Get a particular setting buy name.

	This function does not return copies, so be careful not to mutate objects.
	Raises IndexError if the setting does not exist.
	"""
	global settings
	ensure_loaded()
	return settings[name]
