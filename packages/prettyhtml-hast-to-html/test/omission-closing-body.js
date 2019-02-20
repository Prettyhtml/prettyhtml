'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`body` (closing)', function(t) {
  t.deepEqual(to(h('body'), { omitOptionalTags: true }), '', 'should omit tag without following')

  t.deepEqual(
    to(h('html', [h('body'), u('comment', 'alpha')]), {
      omitOptionalTags: true
    }),
    '</body><!--alpha-->',
    'should not omit tag if followed by `comment`'
  )

  t.deepEqual(
    to(h('html', [h('body'), u('text', 'alpha')]), { omitOptionalTags: true }),
    'alpha',
    'should omit tag if not followed by `comment`'
  )
})
