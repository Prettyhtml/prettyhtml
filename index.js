'use strict'

const vfile = require('to-vfile')
const report = require('vfile-reporter')
const unified = require('unified')
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const minifyAttributes = require('rehype-minify-attribute-whitespace')
const toHTML = require('./lib/hast-to-html')
const format = require('./lib/formatter')
const argv = require('minimist')(process.argv.slice(2))
const globby = require('globby')
const { writeFile } = require('fs-extra')
const glob = argv._[0]

const processor = unified()
  .use(parse)
  .use(sortAttributes)
  .use(minifyAttributes)
  .use(format)
  .freeze()

globby(glob)
  .then(paths => {
    const ops = []
    paths.forEach(path => {
      const op = vfile.read(path).then(data => {
        return processor.run(processor.parse(data)).then(node => {
          writeFile(path, toHTML(node), 'utf8')
        })
      })
      ops.push(op)
    })
    return Promise.all(ops)
  })
  .catch(err => {
    console.error(report(err))
    process.exit(1)
  })
