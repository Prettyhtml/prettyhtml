'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`root`', function(t) {
  t.deepEqual(
    to(u('root', [u('text', 'alpha '), h('i', 'bravo'), u('text', ' charlie')])),
    'alpha <i>bravo</i> charlie',
    'should stringify `root`s'
  )
})
