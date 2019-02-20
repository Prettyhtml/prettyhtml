'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`tfoot` (closing)', function(t) {
  t.deepEqual(to(h('tfoot'), { omitOptionalTags: true }), '<tfoot>', 'should omit tag without siblings')

  t.deepEqual(
    to(h('table', h('tfoot')), { omitOptionalTags: true }),
    '<table><tfoot></table>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('tfoot'), h('tr')]), { omitOptionalTags: true }),
    '<table><tfoot></tfoot><tr></table>',
    'should not omit tag followed by others'
  )
})
