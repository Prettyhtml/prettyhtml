'use strict'

const fs = require('fs')
const path = require('path')
const test = require('tape')
const vfile = require('to-vfile')
const hidden = require('is-hidden')
const negate = require('negate')

const unified = require('unified')
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('../stringify')
const format = require('..')

test('format', function(t) {
  var root = path.join(__dirname, 'fixtures')

  fs.readdir(root, function(err, files) {
    if (err) {
      throw err
    }
    files = files.filter(negate(hidden))
    t.plan(files.length)

    files.forEach(one)
  })

  function one(fixture) {
    var base = path.join(root, fixture)
    var input = vfile.readSync(path.join(base, 'input.html'))
    var output = vfile.readSync(path.join(base, 'output.html'))
    var config
    var proc

    try {
      config = JSON.parse(fs.readFileSync(path.join(base, 'config.json')))
    } catch (err) {}

    proc = unified()
      .use(parse, {
        verbose: true
      })
      .use(format, config)
      .use(stringify, {
        ...config
      })

    proc.process(input, function(err) {
      t.test(fixture, function(st) {
        st.plan(3)
        st.ifErr(err, 'shouldn’t throw')
        st.equal(input.messages.length, 0, 'shouldn’t warn')
        st.equal(String(input), String(output), 'should match')
      })
    })
  }
})
