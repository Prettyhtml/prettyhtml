'use strict'

module.exports = one

var own = {}.hasOwnProperty

/* Stringify `node`. */
function one(ctx, handlers, node, index, parent, printWidthOffset, innerTextLength) {
  var type = node && node.type

  if (!type) {
    throw new Error('Expected node, not `' + node + '`')
  }

  if (!own.call(handlers, type)) {
    throw new Error('Cannot compile unknown node `' + type + '`')
  }
  return handlers[type](ctx, handlers, node, index, parent, printWidthOffset, innerTextLength)
}
