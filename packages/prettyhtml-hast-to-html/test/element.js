'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('`element`', function(t) {
  t.deepEqual(to(h('i', 'bravo')), '<i>bravo</i>', 'should stringify `element`s')

  t.deepEqual(to(h('foo')), '<foo></foo>', 'should stringify unknown `element`s')

  t.deepEqual(to(h('img')), '<img>', 'should stringify void `element`s')

  t.deepEqual(to(h('foo'), { voids: ['foo'] }), '<foo>', 'should stringify given void `element`s')

  t.deepEqual(
    to({
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [h('p', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.'])]
    }),
    '<template><p><b>Bold</b> and <i>italic</i>.</p></template>',
    'should support `<template>`s content'
  )

  t.deepEqual(
    to(h('img'), { closeSelfClosing: true, tightSelfClosing: true }),
    '<img/>',
    'should stringify voids with `/` in `closeSelfClosing` and `tightSelfClosing` mode'
  )
})
