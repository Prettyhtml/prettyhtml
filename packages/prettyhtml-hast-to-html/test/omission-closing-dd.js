'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`dd` (closing)', function(t) {
  t.deepEqual(to(h('dd'), { omitOptionalTags: true }), '<dd>', 'should omit tag without parent')

  t.deepEqual(
    to(h('dl', h('dd')), { omitOptionalTags: true }),
    '<dl><dd></dl>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('dl', [h('dd'), h('dd')]), { omitOptionalTags: true }),
    '<dl><dd><dd></dl>',
    'should omit tag followed by `dd`'
  )

  t.deepEqual(
    to(h('dl', [h('dd'), h('dt')]), { omitOptionalTags: true }),
    '<dl><dd><dt></dt></dl>',
    'should omit tag followed by `dt`'
  )

  t.deepEqual(
    to(h('dl', [h('dd'), h('p')]), { omitOptionalTags: true }),
    '<dl><dd></dd><p></dl>',
    'should not omit tag followed by others'
  )
})
