'use strict'

const restoreTemplateTags = require('./omission/util/restore-template-tags')

module.exports = text

/* Stringify `text`. */
function text(ctx, node, index, parent) {
  var value = node.value

  if (isLiteral(node)) {
    value = restoreTemplateTags(node.value, ctx.templateHoldTag)
  }

  return value
}

/* Check if content of `node` should be escaped. */
function isLiteral(node) {
  return node && (node.tagName === 'script' || node.tagName === 'style')
}
