'use strict'

module.exports = comment

/* Stringify a comment `node`. */
function comment(ctx, handlers, node) {
  return '<!--' + node.value + '-->'
}
