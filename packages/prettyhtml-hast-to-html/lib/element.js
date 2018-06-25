'use strict'

const xtend = require('xtend')
const spaces = require('space-separated-tokens').stringify
const commas = require('comma-separated-tokens').stringify
const information = require('property-information')
const entities = require('stringify-entities')
const kebab = require('kebab-case')
const all = require('./all')
const repeat = require('repeat-string')

module.exports = element

/* Constants. */
var DATA = 'data'
var EMPTY = ''

/* Characters. */
var SPACE = ' '
var DQ = '"'
var SQ = "'"
var EQ = '='
var LT = '<'
var GT = '>'
var SO = '/'

/* Stringify an element `node`. */
function element(ctx, node, index, parent) {
  var name = node.tagName
  var content = all(ctx, name === 'template' ? node.content : node)
  var selfClosing = ctx.voids.indexOf(name.toLowerCase()) !== -1
  var attrs = attributes(ctx, node)
  var omit = ctx.omit
  var value = ''

  /* If the node is categorised as void, but it has
   * children, remove the categorisation.  This
   * enables for example `menuitem`s, which are
   * void in W3C HTML but not void in WHATWG HTML, to
   * be stringified properly. */
  selfClosing = content ? false : selfClosing

  if (attrs || !omit || !omit.opening(node, index, parent)) {
    value = LT + name

    if (attrs) {
      // we don't need to add space we indent it with newline
      if (node.isCustomElement) {
        value += attrs
      } else {
        value += SPACE + attrs
      }
    }

    if (selfClosing && ctx.close) {
      if (!ctx.tightClose || attrs.charAt(attrs.length - 1) === SO) {
        value += SPACE
      }

      value += SO
    }

    value += GT
  }

  value += content

  if (!selfClosing && (!omit || !omit.closing(node, index, parent))) {
    // isCustomElement was set by hast-from-parse
    // break closing element when the custom element has at least one property or one children
    if (
      node.isCustomElement &&
      (Object.keys(node.properties).length > 0 || node.children.length > 0)
    ) {
      value +=
        '\n' +
        repeat(ctx.customElAttrIndent, node.indentLevel) +
        LT +
        SO +
        name +
        GT
    } else {
      value += LT + SO + name + GT
    }
  }

  return value
}

/* Stringify all attributes. */
function attributes(ctx, node) {
  var props = node.properties
  var values = []
  var key
  var value
  var result
  var length
  var index
  var last

  for (key in props) {
    value = props[key]

    if (value == null) {
      continue
    }

    result = attribute(ctx, node, key, value)

    if (result) {
      values.push(result)
    }
  }

  length = values.length
  index = -1

  while (++index < length) {
    result = values[index]
    last = ctx.tight && result.charAt(result.length - 1)

    /* In tight mode, don’t add a space after quoted attributes. */
    if (index !== length - 1 && last !== DQ && last !== SQ) {
      // attributes are aligned in newline we don't need a space
      if (node.isCustomElement) {
        values[index] = result
      } else {
        values[index] = result + SPACE
      }
    }
  }

  return values.join(EMPTY)
}

/* Stringify one attribute. */
function attribute(ctx, node, key, value) {
  var info = information(key) || {}
  var name

  if (
    value == null ||
    (typeof value === 'number' && isNaN(value)) ||
    (!value && info.boolean) ||
    (value === false && info.overloadedBoolean)
  ) {
    return EMPTY
  }

  name = attributeName(ctx, node, key)

  // handle it like boolean attribute
  if (ctx.booleanAttrMarks.indexOf(name[0]) !== -1) {
    return name
  }

  // isCustomElement was set by hast-from-parse
  // TODO only indent with newline when width is larger than print-width
  if (node.isCustomElement) {
    return (
      '\n' +
      repeat(ctx.customElAttrIndent, node.indentLevel + 1) +
      name +
      attributeValue(ctx, key, value)
    )
  }

  return name + attributeValue(ctx, key, value)
}

/* Stringify the attribute name. */
function attributeName(ctx, node, key) {
  var info = information(key) || {}
  var name = info.name || key

  // don't kebab case custom element attributes
  if (!name && !node.isCustomElement) {
    name = kebab(key)
  }

  if (
    name.slice(0, DATA.length) === DATA &&
    /\d/.test(name.charAt(DATA.length))
  ) {
    name = DATA + '-' + name.slice(4)
  }

  return entities(
    name,
    xtend(ctx.entities, {
      subset: ctx.NAME
    })
  )
}

/* Stringify the attribute value. */
function attributeValue(ctx, key, value) {
  var info = information(key) || {}
  var quote = ctx.quote

  if (typeof value === 'object' && 'length' in value) {
    /* `spaces` doesn’t accept a second argument, but it’s
     * given here just to keep the code cleaner. */
    value = (info.commaSeparated ? commas : spaces)(value, {
      padLeft: !ctx.tightLists
    })
  }

  value = String(value)

  if (value !== '') {
    value = EQ + quote + value + quote
  }

  return value
}
