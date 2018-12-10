'use strict'

const minify = require('@starptech/rehype-minify-whitespace')({
  newlines: true
})
const sensitive = require('html-whitespace-sensitive-tag-names')
const is = require('unist-util-is')
const isElement = require('hast-util-is-element')
const repeat = require('repeat-string')
const visit = require('unist-util-visit-parents')
const voids = require('html-void-elements')
const find = require('unist-util-find')
const toString = require('hast-util-to-string')
const prettier = require('prettier')

module.exports = format

/* Constants. */
const single = '\n'
const tab = '\t'
const double = '\n\n'
const space = ' '
const re = /\n/g

const CONDITIONAL_COMMENT_REGEXP = /^\s*\[if .*/
const DOUBLE_BRACKET_INTERPOLATION_REGEXP = /\{\{([\s\S]*?)\}\}/g
const SINGLE_BRACKET_INTERPOLATION_REGEXP = /\{([\s\S]*?)\}/g
const ARROW_PERC_INTERPOLATION_REGEXP = /<%([\s\S]*?)%>/g

/* Format white-space. */
function format(options) {
  const settings = options || {}
  let tabWidth = settings.tabWidth || 2
  let useTabs = settings.useTabs
  let indentInitial = settings.indentInitial
  let usePrettier = settings.usePrettier !== false
  let prettierOpts = settings.prettier
  let indent

  if (useTabs) {
    indent = tab
  } else {
    indent = repeat(space, tabWidth)
  }

  return transform

  function markIgnoreVisitor(node, parents) {
    /**
     * Handle special prettyhtml flags to ignore attribute wrapping and/or whitespace handling
     */
    if (is('comment', node)) {
      if (node.value.indexOf('prettyhtml-ignore') !== -1) {
        return setAttributeOnChildren(node, parents, 'ignore', true)
      } else if (node.value.indexOf('prettyhtml-preserve-whitespace') !== -1) {
        return setAttributeOnChildren(node, parents, 'preserveWhitespace', true)
      } else if (
        node.value.indexOf('prettyhtml-preserve-attribute-wrapping') !== -1
      ) {
        return setAttributeOnChildren(
          node,
          parents,
          'preserveAttrWrapping',
          true
        )
      }
    }
  }

  function setAttributeOnChildren(
    node,
    parents,
    attributeName,
    attributeValue
  ) {
    const parent = parents[parents.length - 1]
    const nodeIndex = parent ? parent.children.indexOf(node) : null
    if (nodeIndex !== null) {
      for (let i = nodeIndex; i < parent.children.length; i++) {
        const child = parent.children[i]
        if (isElement(child)) {
          setNodeData(child, attributeName, attributeValue)
          return visit.SKIP
        }
      }
    }
  }

  function transform(tree) {
    // check if we are in page mode to indent the first level
    indentInitial = isPageMode(tree)

    visit(tree, markIgnoreVisitor)

    let root = minify(tree)

    visit(root, visitor)

    return root

    function visitor(node, parents) {
      // holds a copy of the children
      let children = node.children || []
      let length = children.length
      let index = -1
      let result
      let child
      let level = parents.length

      if (indentInitial === false) {
        level--
      }

      if (node.data && (node.data.ignore || node.data.preserveWhitespace)) {
        return visit.SKIP
      }

      if (is('comment', node)) {
        /**
         * indent last line of comment
         * e.g
         * <!--
         *   foo
         *    -->
         * to
         * <!--
         *   foo
         * -->
         */

        let commentLines = node.value.split(single)
        if (commentLines.length > 1) {
          commentLines[commentLines.length - 1] =
            repeat(indent, level - 1) +
            commentLines[commentLines.length - 1].trim()
          node.value = commentLines.join(single)
        }
      }

      /**
       * If we find whitespace-sensitive nodes / inlines we skip it
       * e.g pre, textarea
       */
      if (ignore(parents.concat(node))) {
        setNodeData(node, 'indentLevel', level - 1)

        // clear empty script, textarea, pre, style tags
        if (length) {
          const empty = containsOnlyEmptyTextNodes(node)
          const isEmbeddedContent =
            isElement(node, 'style') || isElement(node, 'script')
          if (empty) {
            node.children = []
          }
          if (usePrettier && !empty && isEmbeddedContent) {
            prettierEmbeddedContent(node, level, indent, prettierOpts)
          }
        }

        return visit.SKIP
      }

      /**
       * Indent children
       */
      index = -1
      while (++index < length) {
        let child = children[index]

        // only indent text in nodes
        // root text nodes should't influence other root nodes
        if (node.type === 'root') {
          break
        }

        if (is('text', child)) {
          child.value = child.value
            // reduce newlines to one newline
            // $& contains the lastMatch
            .replace(re, '$&' + repeat(indent, level))
        }
      }

      // reset
      result = []
      index = -1

      node.children = result

      let prevChild
      let hasLeadingNewline = false

      if (length) {
        // walk through children
        // hint: a child has no children informations we already walking through
        // the tree
        while (++index < length) {
          child = children[index]

          let indentLevel = level

          setNodeData(child, 'indentLevel', indentLevel)

          if (elementHasGap(prevChild)) {
            result.push({
              type: 'text',
              value: single
            })
          }

          if (
            isElementAfterConditionalComment(node, child, index, prevChild) ||
            isConCommentFollowedByComment(node, child, index, prevChild)
          ) {
            result.push({
              type: 'text',
              value: double + repeat(indent, indentLevel)
            })
          } else if (
            !endsWithNewline(prevChild) &&
            beforeChildNodeAddedHook(node, children, child, index, prevChild)
          ) {
            // all template expression are indented on a ewline thats why need to check
            // so that we don't add another one
            if (index === 0 && isTemplateExpression(child.value)) {
              hasLeadingNewline = true
            }
            // only necessary because we are trying to indent tags on newlines
            // even when in inline context when possible
            if (is('text', prevChild)) {
              // remove trailing whitespaces and tabs because a newline is inserted before
              prevChild.value = prevChild.value.replace(/[ \t]+$/, '')

              // adds a leading newline because the sibling node is indented on a newline
              if (index === 1 && hasLeadingNewline === false) {
                prevChild.value =
                  single + repeat(indent, indentLevel) + prevChild.value
              }
            }
            // remove leading whitespaces and tabs because a newline is inserted before
            if (is('text', child)) {
              child.value = child.value.replace(/^[ \t]+/, '')
            }

            result.push({
              type: 'text',
              value: single + repeat(indent, indentLevel)
            })
          }
          // adds a leading newline when he sibling element was inteded on a newline and when no newlines was added
          else if (
            is('text', child) &&
            hasLeadingNewline === false &&
            endsWithNewline(child) &&
            !startsWithNewline(child)
          ) {
            child.value = single + repeat(indent, indentLevel) + child.value
          }

          prevChild = child

          result.push(child)
        }
      }

      if (afterChildNodesAddedHook(node, prevChild)) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

function endsWithNewline(node) {
  return is('text', node) && node.value && /\s*\n\s*$/.test(node.value)
}

function startsWithNewline(node) {
  return is('text', node) && node.value && /^\s*\n/.test(node.value)
}

function handleTemplateExpression(child, children) {
  if (isTemplateExpression(child.value)) {
    // dont touch nodes with single text element
    if (
      containsOnlyTextNodes({
        children
      })
    ) {
      return false
    }

    // dont add newline when newline is already in text
    if (startsWithNewline(child)) {
      return false
    }

    return true
  }
}

function beforeChildNodeAddedHook(node, children, child, index, prev) {
  if (is('text', child) && handleTemplateExpression(child, children)) {
    return true
  }

  // insert newline when tag is on the same line as the comment
  if (is('comment', prev)) {
    return true
  }

  if (isElement(child, ['script', 'style']) && index !== 0) {
    return true
  }

  // don't add newline on the first element
  const isRootElement = node.type === 'root' && index === 0
  if (isRootElement) {
    return false
  }
  const isChildTextElement = is('text', child)

  return !isChildTextElement
}

function afterChildNodesAddedHook(node, prev) {
  // Add newline on the close tag after root element
  const isRootElement = node.type === 'root'
  if (isRootElement) {
    return true
  }

  const hasChilds = node.children.length > 0

  /**
   * e.g <label><input/>foo</label>
   */
  if (hasChilds && !containsOnlyTextNodes(node) && !isVoid(node)) {
    return true
  }

  /**
   * e.g <label>foo</label>
   */
  const isPrevRawText = is('text', prev)
  return hasChilds && !isVoid(node) && !isPrevRawText
}

function isTemplateExpression(value) {
  // do no track informations
  DOUBLE_BRACKET_INTERPOLATION_REGEXP.lastIndex = 0
  SINGLE_BRACKET_INTERPOLATION_REGEXP.lastIndex = 0
  ARROW_PERC_INTERPOLATION_REGEXP.lastIndex = 0

  // erb ruby templates
  if (ARROW_PERC_INTERPOLATION_REGEXP.test(value)) {
    return true
  }

  // angular, vue
  if (DOUBLE_BRACKET_INTERPOLATION_REGEXP.test(value)) {
    return true
  }

  // svelte
  if (SINGLE_BRACKET_INTERPOLATION_REGEXP.test(value)) {
    return true
  }

  return false
}

function containsOnlyTextNodes(node) {
  const children = node.children || []

  if (children.length === 0) {
    return false
  }

  return children.every(n => is('text', n))
}

function containsOnlyEmptyTextNodes(node) {
  const children = node.children || []

  if (children.length === 0) {
    return false
  }

  return children.every(n => is('text', n) && /^\s+$/.test(n.value))
}

function isElementAfterConditionalComment(node, child, index, prev) {
  // insert double newline when conditional comment is before element
  if (
    is('comment', prev) &&
    CONDITIONAL_COMMENT_REGEXP.test(prev.value) &&
    isElement(child)
  ) {
    return true
  }
  return false
}

function isConCommentFollowedByComment(node, child, index, prev) {
  // insert double newline when conditional comment is before a non conditional comment
  if (
    is('comment', prev) &&
    CONDITIONAL_COMMENT_REGEXP.test(prev.value) &&
    is('comment', child) &&
    !CONDITIONAL_COMMENT_REGEXP.test(child.value)
  ) {
    return true
  }
  return false
}

function elementHasGap(prev) {
  // insert double newline when there was an intended gap before the element in original document
  return prev && prev.data.gapAfter
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

function prettierEmbeddedContent(node, level, indent, prettierOpts) {
  const isStyleTag = isElement(node, 'style')
  const isScriptTag = isElement(node, 'script')
  let content = toString(node)

  if (isScriptTag) {
    content = '<script>' + content + '</script>'
  } else if (isStyleTag) {
    content = '<style>' + content + '</style>'
  }

  let formattedText = prettier.format(
    content,
    Object.assign({}, prettierOpts, {
      parser: 'html'
    })
  )

  if (isScriptTag) {
    formattedText = formattedText
      .replace(/\n*<\/script\s*>/g, '')
      .replace(/<script\s*>\n*/g, '')
  } else if (isStyleTag) {
    formattedText = formattedText
      .replace(/\n*<\/style\s*>/g, '')
      .replace(/<style\s*>\n*/g, '')
  }

  node.children = [
    {
      type: 'text',
      value: single
    },
    {
      type: 'text',
      value: formattedText
    },
    {
      type: 'text',
      value: repeat(indent, level - 1)
    }
  ]
  return formattedText
}

function setNodeData(node, key, value) {
  let data = node.data || {}
  node.data = data
  node.data[key] = value
}

function isPageMode(ast) {
  return !find(ast, function(node) {
    return isElement(node, ['html', 'body', 'head'])
  })
}
