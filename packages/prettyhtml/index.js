'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')
const defaults = require('./defaults')

module.exports = prettyhtml

function core(value, processor, options) {
  const file = new VFile(value)
  return processor()
    .use(format, {
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      prettier: options.prettier
    })
    .use(stringify, {
      tabWidth: options.tabWidth || 2,
      printWidth: options.printWidth || 80
    })
    .processSync(file)
}

function prettyhtml(value, options) {
  options = Object.assign({}, options, {
    parser: defaults.parser
  })
  return core(
    value,
    unified()
      .use(parse, options.parser)
      .freeze(),
    options
  )
}
