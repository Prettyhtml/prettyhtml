'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`option` (closing)', function(t) {
  t.deepEqual(to(h('option'), { omitOptionalTags: true }), '<option>', 'should omit tag without parent')

  t.deepEqual(
    to(h('select', h('option')), { omitOptionalTags: true }),
    '<select><option></select>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('select', [h('option'), h('option')]), { omitOptionalTags: true }),
    '<select><option><option></select>',
    'should omit tag followed by `option`'
  )

  t.deepEqual(
    to(h('select', [h('option'), h('optgroup')]), { omitOptionalTags: true }),
    '<select><option><optgroup></select>',
    'should omit tag followed by `optgroup`'
  )

  t.deepEqual(
    to(h('select', [h('option'), h('p')]), { omitOptionalTags: true }),
    '<select><option></option><p></select>',
    'should not omit tag followed by others'
  )
})
