'use strict'

var test = require('ava')
var u = require('unist-builder')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`body` (opening)', function(t) {
  t.deepEqual(to(h('body'), { omitOptionalTags: true }), '', 'should omit tag without children')

  t.deepEqual(
    to(h('body', u('comment', 'alpha')), { omitOptionalTags: true }),
    '<body><!--alpha-->',
    'should not omit tag if the head is a `comment`'
  )

  t.deepEqual(
    to(h('body', ' alpha'), { omitOptionalTags: true }),
    '<body> alpha',
    'should not omit tag if the head starts with white-space'
  )

  t.deepEqual(
    to(h('body', [h('meta')]), { omitOptionalTags: true }),
    '<body><meta>',
    'should not omit tag if head is `meta`'
  )

  t.deepEqual(
    to(h('body', [h('link')]), { omitOptionalTags: true }),
    '<body><link>',
    'should not omit tag if head is `link`'
  )

  t.deepEqual(
    to(h('body', [h('script')]), { omitOptionalTags: true }),
    '<body><script></script>',
    'should not omit tag if head is `script`'
  )

  t.deepEqual(
    to(h('body', [h('style')]), { omitOptionalTags: true }),
    '<body><style></style>',
    'should not omit tag if head is `style`'
  )

  t.deepEqual(
    to(h('body', [h('template')]), { omitOptionalTags: true }),
    '<body><template></template>',
    'should not omit tag if head is `template`'
  )

  t.deepEqual(
    to(h('body', [h('div')]), { omitOptionalTags: true }),
    '<div></div>',
    'should omit tag if head is something else'
  )
})
