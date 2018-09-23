'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('./webparser')
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
      usePrettier: options.usePrettier,
      prettier: options.prettier
    })
    .use(stringify, {
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      singleQuote: options.singleQuote
    })
    .processSync(file).contents
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
