'use strict'

var fromParse5 = require('@starptech/prettyhtml-hast-util-from-parse')
var Parser5 = require('@starptech/prettyhtml-parse/lib/parser')
var xtend = require('xtend')
var errors = require('./errors.json')

var base = 'https://html.spec.whatwg.org/multipage/parsing.html#parse-error-'

var fatalities = { 2: true, 1: false, 0: null }

module.exports = parse

function parse(options) {
  var settings = xtend(options, this.data('settings'))
  var position = settings.position

  position = typeof position === 'boolean' ? position : true

  this.Parser = parser

  function parser(doc, file) {
    var isFragment = !/<(!doctype|html|head|body)/i.test(doc)
    var fn = settings.fragment || isFragment ? 'parseFragment' : 'parse'
    var onParseError = settings.emitParseErrors ? onerror : null

    if (settings.replaceTemplate) {
      // parse5 will create a new sub-document per fragment and expose their children under a new property called `content`.
      // This makes formatting very hard because the parent relationship is deleted and rehype handle it as a new root element
      // this results in a complete different algorithm
      // the content is restored in prettyhtml-formatter
      doc = doc
        .replace(/<template(.*)>/g, '<' + settings.replaceTemplate + '$1>')
        .replace(/<\/template\s*>/g, '</' + settings.replaceTemplate + '>')
    }

    var parse5 = new Parser5({
      sourceCodeLocationInfo: position,
      onParseError: onParseError,
      scriptingEnabled: false,

      allowLeadingNewlineInTextareaAndPre: true,
      allowSelfClosingCustomElements: true,
      allowCaseSensitiveTagName: true,
      allowCaseSensitiveAttributeName: true
    })

    return fromParse5(parse5[fn](doc), {
      file: file,
      customElementAttrMarker: settings.customElementAttrMarker,
      customElementAttrValueMarker: settings.customElementAttrValueMarker,
      verbose: settings.verbose
    })

    function onerror(err) {
      var code = err.code
      var name = camelcase(code)
      var setting = settings[name]
      var config = setting === undefined || setting === null ? true : setting
      var level = typeof config === 'number' ? config : config ? 1 : 0
      var start = {
        line: err.startLine,
        column: err.startCol,
        offset: err.startOffset
      }
      var end = { line: err.endLine, column: err.endCol, offset: err.endOffset }
      var info
      var message

      if (level) {
        info = errors[name] || /* istanbul ignore next */ {
          reason: '',
          description: ''
        }

        message = file.message(format(info.reason), { start: start, end: end })
        message.source = 'parse-error'
        message.ruleId = code
        message.fatal = fatalities[level]
        message.note = format(info.description)
        message.url = info.url === false ? null : base + code
      }

      function format(value) {
        return value.replace(/%c(?:-(\d+))?/g, char).replace(/%x/g, encodedChar)
      }

      function char($0, $1) {
        var offset = $1 ? -parseInt($1, 10) : 0
        var char = doc.charAt(err.startOffset + offset)
        return char === '`' ? '` ` `' : char
      }

      function encodedChar() {
        var char = doc
          .charCodeAt(err.startOffset)
          .toString(16)
          .toUpperCase()

        return '0x' + char
      }
    }
  }
}

function camelcase(value) {
  return value.replace(/-[a-z]/g, replacer)
}

function replacer($0) {
  return $0.charAt(1).toUpperCase()
}
