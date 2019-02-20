'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`dt` (closing)', function(t) {
  t.deepEqual(to(h('dt'), { omitOptionalTags: true }), '<dt></dt>', 'should not omit tag without parent')

  t.deepEqual(
    to(h('dl', h('dt')), { omitOptionalTags: true }),
    '<dl><dt></dt></dl>',
    'should not omit tag without following'
  )

  t.deepEqual(
    to(h('dl', [h('dt'), h('dt')]), { omitOptionalTags: true }),
    '<dl><dt><dt></dt></dl>',
    'should omit tag followed by `dt`'
  )

  t.deepEqual(
    to(h('dl', [h('dt'), h('dd')]), { omitOptionalTags: true }),
    '<dl><dt><dd></dl>',
    'should omit tag followed by `dd`'
  )

  t.deepEqual(
    to(h('dl', [h('dt'), h('p')]), { omitOptionalTags: true }),
    '<dl><dt></dt><p></dl>',
    'should not omit tag followed by others'
  )
})
