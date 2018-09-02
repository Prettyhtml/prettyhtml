'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`menuitem` (closing)', function(t) {
  t.deepEqual(
    to(h('menuitem', 'alpha'), { omitOptionalTags: true }),
    '<menuitem>alpha',
    'should omit tag without parent'
  )

  t.deepEqual(
    to(h('menu', [h('menuitem', 'alpha')]), { omitOptionalTags: true }),
    '<menu><menuitem>alpha</menu>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('menu', [h('menuitem'), h('menuitem')]), { omitOptionalTags: true }),
    '<menu><menuitem><menuitem></menu>',
    'should omit tag followed by `menuitem`'
  )

  t.deepEqual(
    to(h('menu', [h('menuitem', 'alpha'), h('hr')]), {
      omitOptionalTags: true
    }),
    '<menu><menuitem>alpha<hr></menu>',
    'should omit tag followed by `hr`'
  )

  t.deepEqual(
    to(h('menu', [h('menuitem', 'alpha'), h('menu')]), {
      omitOptionalTags: true
    }),
    '<menu><menuitem>alpha<menu></menu></menu>',
    'should omit tag followed by `menu`'
  )

  t.deepEqual(
    to(h('menu', [h('menuitem', 'alpha'), h('p')]), { omitOptionalTags: true }),
    '<menu><menuitem>alpha</menuitem><p></menu>',
    'should not omit tag followed by others'
  )

  /* This actually tests an edge case where `menuitems`,
   * which can have children in WHATWG HTML, but not in
   * W3C HTML, here do not have children. */
  t.deepEqual(
    to(h('menu', [h('menuitem'), h('p')]), { omitOptionalTags: true }),
    '<menu><menuitem><p></menu>',
    'should omit tag when without children'
  )
})
