'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`html` (opening)', function(t) {
  t.deepEqual(to(h('html'), { omitOptionalTags: true }), '', 'should omit tag without first child')

  t.deepEqual(
    to(h('html', [u('comment', 'alpha'), 'bravo']), { omitOptionalTags: true }),
    '<html><!--alpha-->bravo',
    'should not omit tag if head is `comment`'
  )

  t.deepEqual(
    to(h('html', 'bravo'), { omitOptionalTags: true }),
    'bravo',
    'should omit tag if head is not `comment`'
  )
})
