'use strict'

const Webparser = require('@starptech/webparser')
const fromWebparser = require('@starptech/hast-util-from-webparser')
const VMessage = require('vfile-message')

module.exports = parse

function parse(options) {
  options = options || {}

  this.Parser = parser

  function parser(doc, file) {
    const isDocumentMode = /<(html)/i.test(doc)

    options.documentMode = isDocumentMode

    const parseResult = new Webparser.HtmlParser({
      ignoreFirstLf: false,
      decodeEntities: false,
      selfClosingCustomElements: true
    }).parse(doc)

    for (const err of parseResult.errors) {
      file.message(createVMessage(err))
    }

    return fromWebparser(parseResult.rootNodes, options)
  }

  function createVMessage(err) {
    return new VMessage(
      err.contextualMessage(),
      {
        start: {
          line: err.span.start.line,
          offset: err.span.start.offset,
          column: err.span.start.col
        },
        end: {
          line: err.span.end.line,
          offset: err.span.end.offset,
          column: err.span.end.col
        }
      },
      'ParseError'
    )
  }
}
