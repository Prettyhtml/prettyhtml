'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`head` (opening)', function(t) {
  t.deepEqual(
    to(h('head', h('meta', { charSet: 'utf8' })), { omitOptionalTags: true }),
    '<meta charset="utf8">',
    'should omit tag with children'
  )

  t.deepEqual(to(h('head'), { omitOptionalTags: true }), '<head>', 'should not omit tag without children')

  t.deepEqual(
    to(h('head', h('title', 'alpha')), { omitOptionalTags: true }),
    '<title>alpha</title>',
    'should omit tag with `title`'
  )

  t.deepEqual(to(h('head', h('base')), { omitOptionalTags: true }), '<base>', 'should omit tag with `base`')

  t.deepEqual(
    to(h('head', [h('title'), h('title')]), { omitOptionalTags: true }),
    '<head><title></title><title></title>',
    'should not omit tag with multiple `title`s'
  )

  t.deepEqual(
    to(h('head', [h('base'), h('base')]), { omitOptionalTags: true }),
    '<head><base><base>',
    'should not omit tag with multiple `base`s'
  )
})
