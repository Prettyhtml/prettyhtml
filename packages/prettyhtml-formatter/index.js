'use strict'

const minify = require('rehype-minify-whitespace')({ newlines: true })
const phrasing = require('hast-util-phrasing')
const sensitive = require('html-whitespace-sensitive-tag-names')
const is = require('unist-util-is')
const sectioning = require('hast-util-sectioning')
const labelable = require('hast-util-labelable')
const isElement = require('hast-util-is-element')
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
  let indentInitial = settings.indentInitial

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
      if (ignore(parents.concat(node))) {
        node.indentLevel = level - 1
        node.shouldBreakAttr = false
        return
      }

      if (indentInitial) {
        level--
      }

      /* Indent newlines in `text`. */
      while (++index < length) {
        child = children[index]

        if (is('text', child)) {
          if (child.value.indexOf('\n') !== -1) {
            newline = true
          }

          child.value = child.value.replace(re, '$&' + repeat(indent, level))
        }
      }

      // reset
      result = []
      index = -1

      node.children = result

      if (length) {
        const shouldBreakAttr = shouldBreakAttributesOnMultipleLines(node)
        node.shouldBreakAttr = shouldBreakAttributesOnMultipleLines(node)
        // walk through children
        // a child has no children informations
        while (++index < length) {
          let indentLevel = level

          // collapsed attributes creates a new indent level
          if (shouldBreakAttr) {
            indentLevel++
          }
          child = children[index]
          child.indentLevel = indentLevel

          // Insert 2 newlines
          // 1. check if comment followed by a comment
          // 2. check if newline should be inserted before comment
          if (
            isCommentFollowedByComment(node, child, index, prev) ||
            isCommentBeforeElement(node, child, index, prev)
          ) {
            result.push({
              type: 'text',
              value: single + single + repeat(indent, indentLevel)
            })
          }
          // Insert 1 newline
          // 1. should we break before child node is started?
          // 2. don't break when a newline was already inserted before
          else if (
            beforeChildAddedHook(node, child, index, prev) &&
            !isWhitespace(prev)
          ) {
            result.push({
              type: 'text',
              value: single + repeat(indent, indentLevel)
            })
          }

          prev = child

          result.push(child)
        }
      }

      // 1. hould we break before node is closed?
      // 2. break text when node text was aligned
      if (afterChildsAddedHook(node, prev) || newline) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

function shouldBreakAttributesOnMultipleLines(node) {
  if (node.type === 'root') {
    return false
  }

  if (Object.keys(node.properties).length < 2) {
    return false
  }

  const pos = node.position
  for (const attr in node.data.position.properties) {
    if (pos.start.line !== node.data.position.properties[attr].start.line) {
      return true
    }
  }
  return false
}

function isWhitespace(node) {
  return is('text', node) && node.value && node.value.indexOf('\n') !== -1
}

function beforeChildAddedHook(node, child, index, prev) {
  // insert newline when tag is on the same line as the comment
  if (is('comment', prev)) {
    return true
  }

  // all childs in head should be land in a newline
  if (isElement(node, 'head')) {
    return true
  }

  // newline for closing body tag
  if (isElement(child, 'body')) {
    return true
  }

  if (isElement(child, 'script') || isElement(child, 'style')) {
    return true
  }

  const isRootElement = node.type === 'root' && index === 0
  const isChildTextElement = is('text', child)

  return !isChildTextElement && !isRootElement
}

function isCommentBeforeElement(node, child, index, prev) {
  // insert newline when comment is on the same line as the node
  if (is('comment', child) && isElement(prev)) {
    return true
  }
  return false
}

function isCommentFollowedByComment(node, child, index, prev) {
  if (is('comment', prev) && is('comment', child)) {
    return true
  }
  return false
}

function afterChildsAddedHook(node, prev) {
  const hasChilds = node.children.length > 0
  const isPrevRawText = is('text', prev)

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
