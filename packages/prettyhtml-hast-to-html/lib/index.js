'use strict'

var html = require('property-information/html')
var svg = require('property-information/svg')
var voids = require('html-void-elements')
var omission = require('./omission')
var one = require('./one')
const repeat = require('repeat-string')

module.exports = toHTML

/* Characters. */
var DQ = '"'
var SQ = "'"

/* Stringify the given HAST node. */
function toHTML(node, options) {
  var settings = options || {}
  var quote = settings.quote || DQ
  var alternative = quote === DQ ? SQ : DQ
  var smart = settings.quoteSmart
  var printWidth = settings.printWidth || 80
  var tabWidth = settings.tabWidth || 2 // indent attributes from custom elements

  if (quote !== DQ && quote !== SQ) {
    throw new Error(
      'Invalid quote `' + quote + '`, expected `' + SQ + '` or `' + DQ + '`'
    )
  }

  if (typeof tabWidth === 'number') {
    tabWidth = repeat(' ', tabWidth)
  }

  return one(
    {
      valid: settings.allowParseErrors ? 0 : 1,
      safe: settings.allowDangerousCharacters ? 0 : 1,
      schema: settings.space === 'svg' ? svg : html,
      omit: settings.omitOptionalTags && omission,
      quote: quote,
      printWidth: printWidth,
      tabWidth: tabWidth,
      alternative: smart ? alternative : null,
      unquoted: Boolean(settings.preferUnquoted),
      tight: settings.tightAttributes,
      tightDoctype: Boolean(settings.tightDoctype),
      tightLists: settings.tightCommaSeparatedLists,
      tightClose: settings.tightSelfClosing,
      collapseEmpty: settings.collapseEmptyAttributes,
      dangerous: settings.allowDangerousHTML,
      voids: settings.voids || voids.concat(),
      entities: settings.entities || {},
      close: settings.closeSelfClosing,
      closeEmpty: settings.closeEmptyElements
    },
    node
  )
}
