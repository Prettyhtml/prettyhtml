'use strict'

module.exports = raw

/* Stringify `raw`. */
function raw(ctx, handlers, node) {
  return node.value
}
