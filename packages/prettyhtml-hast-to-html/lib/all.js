'use strict'

var one = require('./one')

module.exports = all

/* Stringify all children of `parent`. */
function all(ctx, parent) {
  var children = parent && parent.children
  var length = children && children.length
  var index = -1
  var results = []

  let printWidthOffset = 0
  while (++index < length) {
    results[index] = one(ctx, children[index], index, parent, printWidthOffset)
    printWidthOffset = results[index].replace(/\n+/g, '').length
  }

  return results.join('')
}
