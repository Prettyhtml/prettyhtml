'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const stringify = require('./lib/stringify')
const format = require('./lib/formatter')

module.exports = prettyhtml

function core(value, processor) {
  const file = new VFile(value)
  return processor()
    .use(stringify)
    .use(sortAttributes)
    .use(format)
    .processSync(file)
}

function prettyhtml(value) {
  return core(
    value,
    unified()
      .use(parse, {
        fragment: true
      })
      .use(stringify)
      .freeze()
  )
}
