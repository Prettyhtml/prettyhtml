'use strict'

const minify = require('rehype-minify-whitespace')({ newlines: false })
const phrasing = require('hast-util-phrasing')
const sensitive = require('html-whitespace-sensitive-tag-names')
const repeat = require('repeat-string')
const visit = require('unist-util-visit-parents')
const voids = require('html-void-elements')

module.exports = format

/* Constants. */
const single = '\n'
var re = /\n/g

/* Format white-space. */
function format(options) {
  const settings = options || {}
  let indent = settings.indent || 2

  if (typeof indent === 'number') {
    indent = repeat(' ', indent)
  }

  return transform

  function transform(tree) {
    let root = minify(tree)

    visit(root, visitor)

    return root

    function visitor(node, parents) {
      // holds a copy of the children
      let children = node.children || []
      let length = children.length
      let level = parents.length
      let index = -1
      let result
      let child
      let prev
      let newline

      /* if we find whitespace-sensitive nodes / inlines we skip it */
      if (!length || ignore(parents.concat(node))) {
        return
      }

      /* Indent newlines in `text`. */
      while (++index < length) {
        child = children[index]

        if (child.tagName === 'textarea') {
          console.log(child.tagName, child)
        }

        if (child.type === 'text') {
          if (child.value.indexOf('\n') !== -1) {
            newline = true
          }

          child.value = child.value.replace(re, '$&' + repeat(indent, level))
        }
      }

      result = []
      index = -1

      node.children = result

      // walk through children
      // a child has no children informations
      while (++index < length) {
        child = children[index]

        // should we break before child node is started?
        if (breakBeforeStartingTag(node, child, index)) {
          node.break = true
          result.push({
            type: 'text',
            value: single + repeat(indent, level)
          })
        }

        prev = child

        result.push(child)
      }

      // should we break before node is closed?
      if (newline || breakBeforeClosingTag(node, prev)) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

function breakBeforeStartingTag(node, child, index) {
  const isRootElement = node.type === 'root' && index === 0
  const isChildTextElement = child.type === 'text'

  return !isChildTextElement && !isRootElement
}

function breakBeforeClosingTag(node, prev) {
  const hasChilds = node.children.length > 0
  const isPrevRawText = prev.type === 'text'

  return hasChilds && !isVoid(node) && !isPrevRawText
}

function isVoid(node) {
  return voids.indexOf(node.tagName) !== -1
}

function ignore(nodes) {
  var index = nodes.length

  while (index--) {
    if (sensitive.indexOf(nodes[index].tagName) !== -1) {
      return true
    }
  }

  return false
}
