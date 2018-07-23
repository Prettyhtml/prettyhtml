'use strict'

const text = require('./text')
const restoreTemplate = require('./omission/util/restore-template-holder')

module.exports = raw

/* Stringify `raw`. */
function raw(ctx, node) {
  return ctx.dangerous
    ? restoreTemplate(node.value, ctx.templateHoldTag)
    : text(ctx, node)
}
