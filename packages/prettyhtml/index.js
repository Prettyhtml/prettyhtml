'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('@starptech/rehype-webparser')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')

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
      wrapAttributes: options.wrapAttributes,
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      singleQuote: options.singleQuote
    })
    .processSync(file)
}

function prettyhtml(value, options) {
  options = Object.assign({}, options)
  return core(
    value,
    unified()
      .use(parse, {
        ignoreFirstLf: false,
        decodeEntities: false,
        selfClosingCustomElements: true,
        selfClosingElements: true
      })
      .freeze(),
    options
  )
}
