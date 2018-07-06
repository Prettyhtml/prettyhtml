'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('toHTML()', function(t) {
  t.throws(
    function() {
      to(true)
    },
    /Expected node, not `true`/,
    'should throw on non-nodes'
  )

  t.throws(
    function() {
      to(u('foo', []))
    },
    /Cannot compile unknown node `foo`/,
    'should throw on unknown nodes'
  )

  t.end()
})
