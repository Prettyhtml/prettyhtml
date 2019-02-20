'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`tr` (closing)', function(t) {
  t.deepEqual(to(h('tr'), { omitOptionalTags: true }), '<tr>', 'should omit tag without siblings')

  t.deepEqual(
    to(h('table', h('tr')), { omitOptionalTags: true }),
    '<table><tr></table>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('tr'), h('tbody')]), { omitOptionalTags: true }),
    '<table><tr></tr><tbody></table>',
    'should not omit tag followed by others'
  )
})
