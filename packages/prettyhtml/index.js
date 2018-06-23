'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')

module.exports = prettyhtml

function core(value, processor) {
  const file = new VFile(value)
  return processor()
    .use(stringify)
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
