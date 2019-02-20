'use strict'

var test = require('ava')
var u = require('unist-builder')
var to = require('..')

test('`comment`', function(t) {
  t.deepEqual(to(u('comment', 'alpha')), '<!--alpha-->', 'should stringify `comment`s')

  t.deepEqual(to(u('comment', 'AT&T')), '<!--AT&T-->', 'should not encode `comment`s (#1)')

  /* No way to get around this. */
  t.deepEqual(to(u('comment', '-->')), '<!---->-->', 'should not encode `comment`s (#2)')
})
