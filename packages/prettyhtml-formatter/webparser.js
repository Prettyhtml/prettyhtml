'use strict'

const Webparser = require('@starptech/webparser')
const fromWebparser = require('@starptech/hast-util-from-webparser').default

module.exports = parse

function parse(options) {
  this.Parser = parser
  function parser(doc, file) {
    const isDocumentMode = /<(html)/i.test(doc)

    options.documentMode = isDocumentMode

    return fromWebparser(
      new Webparser.HtmlParser().parse(doc).rootNodes,
      options
    )
  }
}
