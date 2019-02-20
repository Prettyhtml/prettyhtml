'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`tbody` (closing)', function(t) {
  t.deepEqual(to(h('tbody'), { omitOptionalTags: true }), '<tbody>', 'should omit tag without siblings')

  t.deepEqual(
    to(h('table', h('tbody')), { omitOptionalTags: true }),
    '<table><tbody></table>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('tbody'), h('tbody')]), { omitOptionalTags: true }),
    '<table><tbody><tbody></table>',
    'should omit tag followed by `tbody`'
  )

  t.deepEqual(
    to(h('table', [h('tbody'), h('tfoot')]), { omitOptionalTags: true }),
    '<table><tbody><tfoot></table>',
    'should omit tag followed by `tfoot`'
  )

  t.deepEqual(
    to(h('table', [h('tbody'), h('tr')]), { omitOptionalTags: true }),
    '<table><tbody></tbody><tr></table>',
    'should not omit tag followed by others'
  )
})
