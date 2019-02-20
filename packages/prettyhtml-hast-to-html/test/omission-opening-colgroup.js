'use strict'

var test = require('ava')
var u = require('unist-builder')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`colgroup` (opening)', function(t) {
  t.deepEqual(
    to(h('colgroup'), { omitOptionalTags: true }),
    '<colgroup>',
    'should not omit tag without children'
  )

  t.deepEqual(to(h('colgroup'), { omitOptionalTags: true }), '<colgroup>', 'should omit tag with `col` child')

  t.deepEqual(
    to(h('table', h('colgroup')), { omitOptionalTags: true }),
    '<table><colgroup></table>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('colgroup'), u('comment', 'alpha')]), {
      omitOptionalTags: true
    }),
    '<table><colgroup></colgroup><!--alpha--></table>',
    'should not omit tag followed by `comment`'
  )

  t.deepEqual(
    to(h('table', [h('colgroup'), ' alpha']), { omitOptionalTags: true }),
    '<table><colgroup></colgroup> alpha</table>',
    'should not omit tag followed by white-space'
  )

  t.deepEqual(
    to(h('table', [h('colgroup'), h('tr')]), { omitOptionalTags: true }),
    '<table><colgroup><tr></table>',
    'should omit tag followed by others'
  )
})
