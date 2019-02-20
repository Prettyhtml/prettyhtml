'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`html` (closing)', function(t) {
  t.deepEqual(to(h('html'), { omitOptionalTags: true }), '', 'should omit tag without following')

  t.deepEqual(
    to(u('root', [h('html'), u('comment', 'alpha')]), {
      omitOptionalTags: true
    }),
    '</html><!--alpha-->',
    'should not omit tag if followed by `comment`'
  )

  t.deepEqual(
    to(u('root', [h('html'), u('text', 'alpha')]), { omitOptionalTags: true }),
    'alpha',
    'should omit tag if not followed by `comment`'
  )
})
