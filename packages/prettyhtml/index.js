'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')
const sortAttributes = require('rehype-sort-attributes')
const sortAttributeValues = require('rehype-sort-attribute-values')

module.exports = prettyhtml

function core(value, processor, options) {
  const file = new VFile(value)
  return processor()
    .use(stringify, { customElAttrIndent: options.tabWidth })
    .use(sortAttributes)
    .use(sortAttributeValues)
    .use(format, { indent: options.tabWidth })
    .processSync(file)
}

function prettyhtml(value, options) {
  options = options || {}
  return core(
    value,
    unified()
      .use(parse, {
        fragment: true
      })
      .freeze(),
    options
  )
}
