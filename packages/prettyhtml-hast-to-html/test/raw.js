'use strict'

var test = require('ava')
var u = require('unist-builder')
var to = require('..')

test('`element`', function(t) {
  t.deepEqual(
    to(u('raw', '<script>alert("XSS!")</script>')),
    '<script>alert("XSS!")</script>',
    'should not encode `raw`s'
  )

  t.deepEqual(
    to(u('raw', '<script>alert("XSS!")</script>'), {
      allowDangerousHTML: true
    }),
    '<script>alert("XSS!")</script>',
    'should not encode `raw`s in `allowDangerousHTML` mode'
  )
})
