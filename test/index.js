'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var vfile = require('to-vfile')
var hidden = require('is-hidden')

const unified = require('unified')
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const stringify = require('../lib/stringify')
const format = require('../lib/formatter')

function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments)
  }
}

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
        fragment: true
      })
      .use(stringify)
      .freeze()()

      .use(stringify)
      .use(sortAttributes)
      .use(format, config)

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
