'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`tbody` (opening)', function(t) {
  t.deepEqual(to(h('tbody'), { omitOptionalTags: true }), '<tbody>', 'should not omit tag without children')

  t.deepEqual(to(h('tbody', h('tr')), { omitOptionalTags: true }), '<tr>', 'should omit tag if head is `tr`')

  t.deepEqual(
    to(h('table', [h('thead', h('tr')), h('tbody', h('tr'))]), {
      omitOptionalTags: true
    }),
    '<table><thead><tr><tbody><tr></table>',
    'should not omit tag preceded by an omitted `thead` closing tag'
  )

  t.deepEqual(
    to(h('table', [h('tbody', h('tr')), h('tbody', h('tr'))]), {
      omitOptionalTags: true
    }),
    '<table><tr><tbody><tr></table>',
    'should not omit tag preceded by an omitted `tbody` closing tag'
  )
})
