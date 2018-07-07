'use strict'

const minify = require('rehype-minify-whitespace')({ newlines: true })
const phrasing = require('hast-util-phrasing')
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
const double = '\n\n'
var re = /\n/g

/* Format white-space. */
function format(options) {
  const settings = options || {}
  let tabWidth = settings.tabWidth || 2
  let useTabs = settings.useTabs
  let indentInitial = settings.indentInitial
  let noPrettier = settings.noPrettier
  let prettierOpts = settings.prettier
  let indent

  if (useTabs) {
    indent = '\t'
  } else {
    indent = repeat(' ', tabWidth)
  }

  return transform

  function transform(tree) {
    // check if we are in page mode to indent the first level
    indentInitial = isPageMode(tree)

    let root = minify(tree)

    visit(root, visitor)

    return root

    function visitor(node, parents) {
      // <template> is special they children are exposed under 'content' property
      if (isElement(node, 'template')) {
        minify(node.content)
        visit(node.content, visitor)
        return
      }

      // holds a copy of the children
      let children = node.children || []
      let length = children.length
      let level = parents.length
      let index = -1
      let result
      let child
      let newline

      if (indentInitial === false) {
        level--
      }

      /**
       * If we find whitespace-sensitive nodes / inlines we skip it
       * e.g pre, textarea
       */
      if (ignore(parents.concat(node))) {
        setData(node, 'indentLevel', level - 1)
        setData(node, 'shouldBreakAttr', false)

        // clear empty script, textarea, pre, style tags
        if (length) {
          const empty = containsOnlyEmptyTextNodes(node)
          if (empty) {
            node.children = []
          }
          if (!noPrettier && !empty) {
            prettierEmbeddedContent(node, level, prettierOpts)
          }
        }

        return
      }

      /**
       * When 'prettyhtml-ignore' flag is set we can ignore this element
       * In order to ignore the whole element tree we have to ignore all childs.
       */
      index = -1
      if (getData(node, 'ignoreFlagged')) {
        while (++index < length) {
          let child = children[index]
          setData(child, 'ignoreFlagged', true)
        }
        return
      }

      /**
       * Flag the next element after the ignore flag
       */
      let found
      while (++index < length) {
        let child = children[index]
        if (is('comment', child)) {
          if (child.value.indexOf('prettyhtml-ignore') !== -1) {
            found = true
          }
        } else if (isElement(child) && found) {
          setData(child, 'ignoreFlagged', true)
          break
        }
      }

      /**
       * Indent newlines in `text`.
       * e.g <p>foo <strong>bar</strong></p> to
       * <p>
       *    foo
       *    <strong>bar</strong>
       * </p>
       * Remove leading and trailing spaces and tabs
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
          if (child.value.indexOf('\n') !== -1) {
            newline = true
          }
          child.value = child.value
            .replace(/^[ \t]+|[ \t]+$/g, '')
            .replace(re, '$&' + repeat(indent, level))
        }
      }

      // reset
      result = []
      index = -1

      node.children = result

      let prevChild

      // check if we indent the attributes in newlines
      setData(node, 'collapseAttr', collapseAttributes(node))

      if (length) {
        // walk through children
        // a child has no children informations
        while (++index < length) {
          let indentLevel = level

          // collapsed attributes creates a new indent level
          if (getData(node, 'collapseAttr')) {
            indentLevel++
          }

          child = children[index]
          setData(child, 'indentLevel', indentLevel)

          /**
           * Insert 2 newline
           * 1. check if an element is followed by a conditional comment
           * 2. check if a comment is followed by a conditional comment
           * 3. check if a comment is before an element
           */
          if (
            isElementAfterConditionalComment(node, child, index, prevChild) ||
            isConCommentFollowedByComment(node, child, index, prevChild) ||
            isCommentBeforeElement(node, child, index, prevChild)
          ) {
            result.push({
              type: 'text',
              value: double + repeat(indent, indentLevel)
            })
          } else if (
            /**
             * Insert 1 newline
             * 1. should we break before child node is started
             * 2. don't break when a newline was already inserted before
             * 3. break text in newline when it's the first node
             */
            (beforeChildNodeAddedHook(node, child, index, prevChild) &&
              !isNewline(prevChild)) ||
            (newline && index === 0)
          ) {
            result.push({
              type: 'text',
              value: single + repeat(indent, indentLevel)
            })
          }

          prevChild = child

          result.push(child)
        }
      }

      // 1. hould we break before node is closed?
      // 2. break text when node text was aligned
      if (afterChildNodesAddedHook(node, prevChild) || newline) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

function collapseAttributes(node) {
  if (!isElement(node) || node.type === 'root') {
    return false
  }

  if (Object.keys(node.properties).length < 2) {
    return false
  }

  // when attributes was already indented on newlines
  const pos = node.position
  for (const attr in node.data.position.properties) {
    if (pos.start.line !== node.data.position.properties[attr].start.line) {
      return true
    }
  }
  return false
}

function isNewline(node) {
  return is('text', node) && node.value && node.value.indexOf('\n') !== -1
}

function beforeChildNodeAddedHook(node, child, index, prev) {
  // insert newline when tag is on the same line as the comment
  if (is('comment', prev)) {
    return true
  }

  if (isElement(child, ['script', 'style']) && index !== 0) {
    return true
  }

  // dont add newline on the first elmement
  const isRootElement = node.type === 'root' && index === 0
  if (isRootElement) {
    return false
  }
  const isChildTextElement = is('text', child)

  return !isChildTextElement
}

function afterChildNodesAddedHook(node, prev) {
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

function containsOnlyTextNodes(node) {
  const children = node.children || []
  return children.every(n => is('text', n))
}

function containsOnlyEmptyTextNodes(node) {
  const children = node.children || []
  return children.every(n => is('text', n) && /^\s+$/.test(n.value))
}

function isCommentBeforeElement(node, child, index, prev) {
  // insert newline when comment is on the same line as the element
  if (is('comment', child) && isElement(prev)) {
    return true
  }
  return false
}

function isElementAfterConditionalComment(node, child, index, prev) {
  // insert double newline when conditional comment is before element
  if (
    is('comment', prev) &&
    prev.value.indexOf('if') !== -1 &&
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
    prev.value.indexOf('if') !== -1 &&
    is('comment', child) &&
    child.value.indexOf('if') === -1
  ) {
    return true
  }
  return false
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

function prettierEmbeddedContent(node, level, prettierOpts) {
  if (isElement(node, 'style')) {
    const content = toString(node)
    node.children = []
    const typeAttr = node.properties.type
    let parser = 'css'
    if (typeAttr === 'text/x-scss') {
      parser = 'scss'
    } else if (typeAttr === 'text/less') {
      parser = 'less'
    } else {
      const langAttr = node.properties.lang
      if (langAttr === 'postcss') {
        parser = 'css'
      } else if (langAttr === 'scss') {
        parser = 'scss'
      } else if (langAttr === 'less') {
        parser = 'less'
      } else {
        parser = 'css'
      }
    }

    let formattedText = prettier.format(
      content,
      Object.assign(
        {
          parser
        },
        prettierOpts
      )
    )
    formattedText = indentPrettierOutput(formattedText, level)

    node.children = [
      { type: 'text', value: '\n' },
      { type: 'text', value: formattedText },
      { type: 'text', value: repeat('  ', level - 1) }
    ]
  } else if (isElement(node, 'script')) {
    const content = toString(node)
    node.children = []
    const typeAttr = node.properties.type
    let parser = 'babylon'

    if (typeAttr === 'application/x-typescript') {
      parser = 'typescript'
    } else {
      const langAttr = node.properties.lang

      if (langAttr === 'ts' || langAttr === 'tsx') {
        parser = 'typescript'
      } else {
        parser = 'babylon'
      }
    }

    let formattedText = prettier.format(
      content,
      Object.assign(
        {
          parser
        },
        prettierOpts
      )
    )
    formattedText = indentPrettierOutput(formattedText, level)

    node.children = [
      { type: 'text', value: '\n' },
      { type: 'text', value: formattedText },
      { type: 'text', value: repeat('  ', level - 1) }
    ]
  }
}

function indentPrettierOutput(formattedText, level) {
  let lines = formattedText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    if (i === lines.length - 1) {
      lines[i] = lines[i]
    } else {
      lines[i] = repeat('  ', level) + lines[i]
    }
  }

  return lines.join('\n')
}

function setData(node, key, value) {
  let data = node.data || {}
  node.data = data
  node.data[key] = value
}

function getData(node, key) {
  if (node.data) {
    return node.data[key]
  }
}

function isPageMode(ast) {
  return !find(ast, function(node) {
    return isElement(node, ['html', 'body', 'head'])
  })
}
