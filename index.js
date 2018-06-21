'use strict'

const VFile = require('vfile')
const unified = require('unified')
const sort = require('vfile-sort')
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const minifyAttributes = require('rehype-minify-attribute-whitespace')
const stringify = require('./lib/stringify')
const format = require('./lib/formatter')

module.exports = prettyhtml

function core(value, processor) {
  const file = new VFile(value)
  const tree = processor.parse(file)

  processor.runSync(tree, file)

  sort(file)

  return file
}

function prettyhtml(value, allow) {
  return core(
    value,
    unified()
      .use(parse, {
        fragment: true
      })
      .use(stringify)
      .use(sortAttributes)
      .use(minifyAttributes)
      .use(format)
  )
}
