'use strict'

var information = require('property-information')
var h = require('@starptech/prettyhtml-hastscript')
var xtend = require('xtend')
var count = require('ccount')

module.exports = wrapper

var own = {}.hasOwnProperty

/* Handlers. */
var map = {
  '#document': root,
  '#document-fragment': root,
  '#text': text,
  '#comment': comment,
  '#documentType': doctype
}

/* Wrapper to normalise options. */
function wrapper(ast, options) {
  var settings = options || {}
  var file

  if (settings.messages) {
    file = settings
    settings = {}
  } else {
    file = settings.file
  }

  return transform(ast, {
    file: file,
    verbose: settings.verbose,
    location: false
  })
}

/* Transform a node. */
function transform(ast, config) {
  var fn = own.call(map, ast.nodeName) ? map[ast.nodeName] : element
  var children
  var node
  var pos

  if (ast.childNodes) {
    children = nodes(ast.childNodes, config)
  }

  node = fn(ast, children, config)

  if (ast.sourceCodeLocation && config.file) {
    pos = location(node, ast.sourceCodeLocation, config.verbose)

    if (pos) {
      config.location = true
      node.position = pos
    }
  }

  // extend hast data property with 'selfClosing' information
  node.data = node.data || {}
  node.data.selfClosing = ast.selfClosing

  return node
}

/* Transform children. */
function nodes(children, config) {
  var length = children.length
  var index = -1
  var result = []

  while (++index < length) {
    result[index] = transform(children[index], config)
  }

  return result
}

/* Transform a document.
 * Stores `ast.quirksMode` in `node.data.quirksMode`. */
function root(ast, children, config) {
  var node = { type: 'root', children: children, data: {} }
  var doc

  node.data.quirksMode = ast.mode === 'quirks' || ast.mode === 'limited-quirks'

  if (config.file && config.location) {
    doc = String(config.file)

    node.position = {
      start: { line: 1, column: 1, offset: 0 },
      end: {
        line: count(doc, '\n') + 1,
        column: doc.length - doc.lastIndexOf('\n'),
        offset: doc.length
      }
    }
  }

  return node
}

/* Transform a doctype. */
function doctype(ast) {
  return {
    type: 'doctype',
    name: ast.name || '',
    public: ast.publicId || null,
    system: ast.systemId || null
  }
}

/* Transform a text. */
function text(ast) {
  return { type: 'text', value: ast.value }
}

/* Transform a comment. */
function comment(ast) {
  return { type: 'comment', value: ast.data }
}

/* Transform an element. */
function element(ast, children, config) {
  var props = {}
  var values = ast.attrs
  var length = values.length
  var index = -1
  var attr
  var node
  var pos
  var start
  var end

  while (++index < length) {
    attr = values[index]
    props[(attr.prefix ? attr.prefix + ':' : '') + attr.name] = attr.value
  }

  node = h(ast.tagName, props, children)

  if (ast.nodeName === 'template' && 'content' in ast) {
    pos = ast.sourceCodeLocation
    start = pos && pos.startTag && position(pos.startTag).end
    end = pos && pos.endTag && position(pos.endTag).start

    node.content = transform(ast.content, config)

    if ((start || end) && config.file) {
      node.content.position = { start: start, end: end }
    }
  }

  return node
}

/* Create clean positional information. */
function location(node, location, verbose) {
  var pos = position(location)
  var reference
  var values
  var props
  var prop
  var name

  if (node.type === 'element') {
    reference = node.children[node.children.length - 1]

    /* Unclosed with children (upstream: https://github.com/inikulin/parse5/issues/109) */
    if (
      !location.endTag &&
      reference &&
      reference.position &&
      reference.position.end
    ) {
      pos.end = xtend(reference.position.end)
    }

    if (verbose) {
      values = location.attrs
      props = {}

      for (prop in values) {
        name = (information(prop) || {}).propertyName || prop
        props[name] = position(values[prop])
      }

      node.data = {
        position: {
          opening: position(location.startTag),
          closing: location.endTag ? position(location.endTag) : null,
          properties: props
        }
      }
    }
  }

  return pos
}

function position(loc) {
  var start = point({
    line: loc.startLine,
    column: loc.startCol,
    offset: loc.startOffset
  })
  var end = point({
    line: loc.endLine,
    column: loc.endCol,
    offset: loc.endOffset
  })
  return start || end ? { start: start, end: end } : null
}

function point(point) {
  return point.line && point.column ? point : null
}
