'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`p` (closing)', function(t) {
  t.deepEqual(to(u('root', [h('p')]), { omitOptionalTags: true }), '<p>', 'should omit tag without following')

  t.deepEqual(
    to(u('root', [h('p'), h('address')]), { omitOptionalTags: true }),
    '<p><address></address>',
    'should omit tag if followed by `address`'
  )

  t.deepEqual(
    to(u('root', [h('p'), h('ul')]), { omitOptionalTags: true }),
    '<p><ul></ul>',
    'should omit tag if followed by `ul`'
  )

  t.deepEqual(
    to(u('root', [h('p'), h('a')]), { omitOptionalTags: true }),
    '<p></p><a></a>',
    'should not omit tag if followed by `a`'
  )

  t.deepEqual(
    to(u('root', [h('p'), h('xmp')]), { omitOptionalTags: true }),
    '<p></p><xmp></xmp>',
    'should not omit tag if followed by `xmp`'
  )

  t.deepEqual(to(h('p'), { omitOptionalTags: true }), '<p>', 'should omit tag without parent')

  t.deepEqual(
    to(h('a', [h('p')]), { omitOptionalTags: true }),
    '<a><p></p></a>',
    'should not omit tag if parent is `a`'
  )

  t.deepEqual(
    to(h('video', [h('p')]), { omitOptionalTags: true }),
    '<video><p></p></video>',
    'should not omit tag if parented by `video`'
  )

  t.deepEqual(
    to(h('article', [h('p')]), { omitOptionalTags: true }),
    '<article><p></article>',
    'should not omit tag if parent is `article`'
  )

  t.deepEqual(
    to(h('section', [h('p')]), { omitOptionalTags: true }),
    '<section><p></section>',
    'should not omit tag if parented by `section`'
  )
})
