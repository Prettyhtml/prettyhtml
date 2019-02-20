'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`optgroup` (closing)', function(t) {
  t.deepEqual(to(h('optgroup'), { omitOptionalTags: true }), '<optgroup>', 'should omit tag without parent')

  t.deepEqual(
    to(h('select', h('optgroup')), { omitOptionalTags: true }),
    '<select><optgroup></select>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('select', [h('optgroup'), h('optgroup')]), { omitOptionalTags: true }),
    '<select><optgroup><optgroup></select>',
    'should omit tag followed by `optgroup`'
  )

  t.deepEqual(
    to(h('select', [h('optgroup'), h('p')]), { omitOptionalTags: true }),
    '<select><optgroup></optgroup><p></select>',
    'should not omit tag followed by others'
  )
})
