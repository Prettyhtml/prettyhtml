'use strict'

const xtend = require('xtend')
const toHTML = require('./hast-to-html')

module.exports = stringify

function stringify(config) {
  var settings = xtend(config, this.data('settings'))

  this.Compiler = compiler

  function compiler(tree) {
    return toHTML(tree, settings)
  }
}
