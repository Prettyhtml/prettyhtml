/* eslint-disable import/no-extraneous-dependencies */

'use strict'

const fs = require('fs')
const path = require('path')
const test = require('ava')
const vfile = require('to-vfile')
const hidden = require('is-hidden')
const negate = require('negate')

const unified = require('unified')
const parse = require('@starptech/rehype-webparser')
const stringify = require('../stringify')
const format = require('..')

const root = path.join(__dirname, 'fixtures')

fs.readdirSync(root)
  .filter(negate(hidden))
  .forEach(each)

function each(fixture) {
  test.cb(fixture, function eachFixture(t) {
    const base = path.join(root, fixture)
    const opts = {
      base,
      input: vfile.readSync(path.join(base, 'input.html')),
      output: vfile.readSync(path.join(base, 'output.html'))
    }

    t.plan(3)

    check(t, fixture, opts)
  })
}

function check(t, fixture, options) {
  let config

  try {
    config = JSON.parse(fs.readFileSync(path.join(options.base, 'config.json')))
    // eslint-disable-next-line no-empty
  } catch (err) {}

  const proc = unified()
    .use(parse, {
      ignoreFirstLf: false,
      decodeEntities: false,
      selfClosingCustomElements: true,
      selfClosingElements: true
    })
    .use(format, config)
    .use(
      stringify,
      Object.assign(
        {
          closeSelfClosing: true,
          closeEmptyElements: true
        },
        config
      )
    )

  proc.process(options.input, function process(err /* ,vFile */) {
    t.falsy(err, 'shouldn’t throw')
    t.is(options.input.messages.length, 0, 'shouldn’t warn')
    t.is(String(options.input), String(options.output), 'should match')
    // fs.writeFileSync(path.join(options.base, 'output.html'), vFile.contents)
    t.end()
  })
}
