'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`head` (closing)', function(t) {
  t.deepEqual(to(h('head'), { omitOptionalTags: true }), '<head>', 'should omit tag without following')

  t.deepEqual(
    to(h('html', [h('head'), u('comment', 'alpha')]), {
      omitOptionalTags: true
    }),
    '<head></head><!--alpha-->',
    'should not omit tag if followed by `comment`'
  )

  t.deepEqual(
    to(h('html', [h('head'), ' alpha']), { omitOptionalTags: true }),
    '<head></head> alpha',
    'should not omit tag if the next sibling starts with white-space'
  )

  t.deepEqual(
    to(h('html', [h('head'), u('text', 'alpha')]), { omitOptionalTags: true }),
    '<head>alpha',
    'should omit tag if not followed by `comment`'
  )
})
