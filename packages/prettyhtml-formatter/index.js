'use strict'

const minify = require('rehype-minify-whitespace')({ newlines: true })
const phrasing = require('hast-util-phrasing')
const sensitive = require('html-whitespace-sensitive-tag-names')
const repeat = require('repeat-string')
const visit = require('unist-util-visit-parents')

module.exports = format

/* Constants. */
const single = '\n'
const re = /\n/g

/* Format white-space. */
function format(options) {
  const settings = options || {}
  let indent = settings.indent || 2
  let indentInitial = settings.indentInitial

  if (typeof indent === 'number') {
    indent = repeat(' ', indent)
  }

  /* Default to indenting the initial level. */
  if (indentInitial === null || indentInitial === undefined) {
    indentInitial = true
  }

  return transform

  function transform(tree) {
    let root = minify(tree)
    let head = false

    visit(root, visitor)

    return root

    function visitor(node, parents) {
      let children = node.children || []
      let length = children.length
      let level = parents.length
      let index = -1
      let result
      let prev
      let child
      let newline

      if (node.type === 'element' && node.tagName === 'head') {
        head = true
      }

      if (head && node.type === 'element' && node.tagName === 'body') {
        head = false
      }

      /* Don’t indent content of whitespace-sensitive nodes / inlines. */
      if (!length || !padding(node, head) || ignore(parents.concat(node))) {
        node.indentLevel = level - 1
        return
      }

      if (!indentInitial) {
        level--
      }

      // Indent newlines in `text`
      while (++index < length) {
        child = children[index]
        if (child.type === 'text') {
          if (child.value.indexOf('\n') !== -1) {
            newline = true
          }
          // add indentation after newline
          child.value = child.value.replace(re, '$&' + repeat(indent, level))
        }
      }

      result = []
      index = -1

      node.children = result

      while (++index < length) {
        child = children[index]

        // never indent the first node on root
        if (node.type === 'root' && index === 0) {
          child.indentLevel = level
          prev = child
          result.push(child)
          continue
        }

        if (
          padding(child, head) ||
          // only insert newline when no previous text element includes a newline
          (newline && index === 0)
        ) {
          // extra new line to separate it as a section
          // don't add newline when a comment is followed by comment
          if (
            child.type === 'comment' &&
            index + 1 <= children.length - 1 &&
            children[index + 1].type !== 'comment'
          ) {
            result.push({
              type: 'text',
              value: single
            })
          }

          child.indentLevel = level
          result.push({
            type: 'text',
            value: single + repeat(indent, level)
          })
        }

        prev = child
        result.push(child)
      }

      if (newline || padding(prev, head)) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

/**
 * Add newline after script tags, comments and non-phrasing elements or head element.
 * Phrasing content is the text of the document, as well as elements that mark up that text at the intra-paragraph level
 * @param {*} node
 * @param {*} head
 */
function padding(node, head) {
  if (node.type === 'root') {
    return true
  }

  // each comment should appear on a saparate line
  if (node.type === 'comment') {
    return true
  } else if (node.type === 'element') {
    return node.tagName === 'script' || !phrasing(node) || head
  }

  return false
}

/**
 * Check if an element is case-sensitive
 * @param {*} nodes
 * @returns
 */
function ignore(nodes) {
  var index = nodes.length

  while (index--) {
    if (sensitive.indexOf(nodes[index].tagName) !== -1) {
      return true
    }
  }

  return false
}
