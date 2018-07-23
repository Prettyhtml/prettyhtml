'use strict'

const xtend = require('xtend')
const restoreTemplate = require('./omission/util/restore-template-holder')
const entities = require('stringify-entities')

module.exports = text

/* Stringify `text`. */
function text(ctx, node, index, parent) {
  var value = restoreTemplate(node.value, ctx.templateHoldTag)

  return isLiteral(parent)
    ? value
    : entities(
        value,
        xtend(ctx.entities, {
          subset: ['<', '&']
        })
      )
}

/* Check if content of `node` should be escaped. */
function isLiteral(node) {
  return node && (node.tagName === 'script' || node.tagName === 'style')
}
