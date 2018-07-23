'use strict'

const restoreTemplate = require('./omission/util/restore-template-holder')

module.exports = text

/* Stringify `text`. */
function text(ctx, node, index, parent) {
  var value = restoreTemplate(node.value, ctx.templateHoldTag)

  return value
}

/* Check if content of `node` should be escaped. */
function isLiteral(node) {
  return node && (node.tagName === 'script' || node.tagName === 'style')
}
