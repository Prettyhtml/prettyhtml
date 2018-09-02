'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`thead` (closing)', function(t) {
  t.deepEqual(
    to(h('thead'), { omitOptionalTags: true }),
    '<thead></thead>',
    'should not omit tag without siblings'
  )

  t.deepEqual(
    to(h('table', h('thead')), { omitOptionalTags: true }),
    '<table><thead></thead></table>',
    'should not omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('thead'), h('tbody')]), { omitOptionalTags: true }),
    '<table><thead><tbody></table>',
    'should omit tag followed by `tbody`'
  )

  t.deepEqual(
    to(h('table', [h('thead'), h('tfoot')]), { omitOptionalTags: true }),
    '<table><thead><tfoot></table>',
    'should omit tag followed by `tfoot`'
  )

  t.deepEqual(
    to(h('table', [h('thead'), h('tr')]), { omitOptionalTags: true }),
    '<table><thead></thead><tr></table>',
    'should not omit tag followed by others'
  )
})
