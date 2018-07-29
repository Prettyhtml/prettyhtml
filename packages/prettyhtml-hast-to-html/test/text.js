'use strict'

var test = require('tape')
var h = require('hastscript')
var u = require('unist-builder')
var to = require('..')

test('`text`', function(t) {
  t.deepEqual(to(u('text', 'alpha')), 'alpha', 'should stringify `text`s')

  t.deepEqual(
    to(u('text', '3 < 5 & 7')),
    '3 &#x3C; 5 &#x26; 7',
    'should encode `text`s'
  )

  t.deepEqual(
    to(h('style', u('text', '*:before {content: "3 < 5"}'))),
    '<style>*:before {content: "3 < 5"}</style>',
    'should not encode `text`s in `style`'
  )

  t.deepEqual(
    to(h('script', u('text', 'alert("3 < 5")'))),
    '<script>alert("3 < 5")</script>',
    'should not encode `text`s in `script`'
  )

  t.deepEqual(
    to(h('b', u('text', '3 < 5'))),
    '<b>3 &#x3C; 5</b>',
    'should encode `text`s in other nodes'
  )

  t.end()
})
