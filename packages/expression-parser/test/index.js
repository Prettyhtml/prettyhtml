'use strict'

const test = require('ava')
const parse = require('..')
const tests = require('./texpr')

function getOptions(opt) {
  return {
    brackets: ['{', '}'],
    ...opt
  }
}

Object.keys(tests).forEach(title => {
  test(title, function(t) {
    const test = tests[title]
    const result = parse(test.data, getOptions(test.options))
    t.snapshot({ input: test.data, result })
  })
})
