'use strict'

const is = require('unist-util-is')
const whiteSpace = require('hast-util-whitespace')

module.exports = whiteSpaceLeft

/* Check if `node` starts with white-space. */
function whiteSpaceLeft(node) {
  return is('text', node) && whiteSpace(node.value.charAt(0))
}
