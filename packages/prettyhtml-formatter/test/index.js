'use strict'

const fs = require('fs')
const path = require('path')
const test = require('ava')
const vfile = require('to-vfile')
const hidden = require('is-hidden')
const negate = require('negate')

const unified = require('unified')
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('../stringify')
const format = require('..')

const root = path.join(__dirname, 'fixtures')

fs.readdirSync(root)
  .filter(negate(hidden))
  .forEach(each)

function each(fixture) {
  test.cb(fixture, function(t) {
    var base = path.join(root, fixture)
    var opts = {
      base: base,
      input: vfile.readSync(path.join(base, 'input.html')),
      output: vfile.readSync(path.join(base, 'output.html'))
    }

    t.plan(3)

    check(t, fixture, opts)
  })
}

function check(t, fixture, options) {
  var config
  var proc

  try {
    config = JSON.parse(fs.readFileSync(path.join(options.base, 'config.json')))
  } catch (err) {}

  proc = unified()
    .use(parse, {
      verbose: true
    })
    .use(format, config)
    .use(stringify, {
      ...config
    })

  proc.process(options.input, function(err) {
    t.falsy(err, 'shouldn’t throw')
    t.is(options.input.messages.length, 0, 'shouldn’t warn')
    t.is(String(options.input), String(options.output), 'should match')
    t.end()
  })
}
