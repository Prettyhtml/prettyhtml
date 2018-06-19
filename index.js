'use strict'

const vfile = require('to-vfile')
const report = require('vfile-reporter')
const unified = require('unified')
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const minifyAttributes = require('rehype-minify-attribute-whitespace')
const stringify = require('./lib/stringify')
const format = require('./lib/formatter')

const fileContent = vfile.readSync('./fixtures/component.html')

unified()
  .use(parse)
  .use(stringify)
  .use(sortAttributes)
  .use(minifyAttributes)
  .use(format)
  .process(fileContent, function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
