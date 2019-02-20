'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`li` (closing)', function(t) {
  t.deepEqual(to(h('li'), { omitOptionalTags: true }), '<li>', 'should omit tag without parent')

  t.deepEqual(
    to(h('ol', h('li')), { omitOptionalTags: true }),
    '<ol><li></ol>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('ol', [h('li'), h('li')]), { omitOptionalTags: true }),
    '<ol><li><li></ol>',
    'should omit tag followed by `li`'
  )

  t.deepEqual(
    to(h('ol', [h('li'), h('p')]), { omitOptionalTags: true }),
    '<ol><li></li><p></ol>',
    'should not omit tag followed by others'
  )
})
