'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`caption` (closing)', function(t) {
  t.deepEqual(
    to(h('caption'), { omitOptionalTags: true }),
    '<caption>',
    'should not omit tag without children'
  )

  t.deepEqual(
    to(h('table', h('caption')), { omitOptionalTags: true }),
    '<table><caption></table>',
    'should omit tag without following'
  )

  t.deepEqual(
    to(h('table', [h('caption'), u('comment', 'alpha')]), {
      omitOptionalTags: true
    }),
    '<table><caption></caption><!--alpha--></table>',
    'should not omit tag followed by `comment`'
  )

  t.deepEqual(
    to(h('table', [h('caption'), ' alpha']), { omitOptionalTags: true }),
    '<table><caption></caption> alpha</table>',
    'should not omit tag followed by white-space'
  )

  t.deepEqual(
    to(h('table', [h('caption'), h('tr')]), { omitOptionalTags: true }),
    '<table><caption><tr></table>',
    'should omit tag followed by others'
  )
})
