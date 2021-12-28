'use strict'

var handlers = {}

handlers.root = require('./all')
handlers.text = require('./text')
handlers.element = require('./element')
handlers.doctype = require('./doctype')
handlers.comment = require('./comment')
handlers.raw = require('./raw')

module.exports = handlers
