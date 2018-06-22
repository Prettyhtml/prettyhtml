'use strict'

var test = require('tape')
var h = require('.')

test('hastscript', function(t) {
  t.equal(typeof h, 'function', 'should expose a function')

  t.test('selector', function(st) {
    st.deepEqual(
      h(),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should create a `div` element without arguments'
    )

    st.deepEqual(
      h('.bar', { class: 'baz' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['bar', 'baz'] },
        children: []
      },
      'should append to the selector’s classes'
    )

    st.deepEqual(
      h('#id'),
      {
        type: 'element',
        tagName: 'div',
        properties: { id: 'id' },
        children: []
      },
      'should create a `div` element when given an id selector'
    )

    st.deepEqual(
      h('#a#b'),
      {
        type: 'element',
        tagName: 'div',
        properties: { id: 'b' },
        children: []
      },
      'should create an element with the last ID when given ' +
        'multiple in a selector'
    )

    st.deepEqual(
      h('.foo'),
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['foo'] },
        children: []
      },
      'should create a `div` element when given a class selector'
    )

    st.deepEqual(
      h('foo'),
      {
        type: 'element',
        tagName: 'foo',
        properties: {},
        children: []
      },
      'should create a `foo` element when given a tag selector'
    )

    st.deepEqual(
      h('foo#bar'),
      {
        type: 'element',
        tagName: 'foo',
        properties: { id: 'bar' },
        children: []
      },
      'should create a `foo` element with an ID when given a both ' +
        'as a selector'
    )

    st.deepEqual(
      h('foo.bar'),
      {
        type: 'element',
        tagName: 'foo',
        properties: { className: ['bar'] },
        children: []
      },
      'should create a `foo` element with a class when given a both ' +
        'as a selector'
    )

    st.deepEqual(
      h('.foo.bar'),
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['foo', 'bar'] },
        children: []
      },
      'should support multiple classes'
    )

    st.end()
  })

  t.test('properties', function(st) {
    st.deepEqual(
      h(null, { foo: 'bar' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { foo: 'bar' },
        children: []
      },
      'should support unknown `string` values'
    )

    st.deepEqual(
      h(null, { foo: 3 }),
      {
        type: 'element',
        tagName: 'div',
        properties: { foo: 3 },
        children: []
      },
      'should support unknown `number` values'
    )

    st.deepEqual(
      h(null, { foo: true }),
      {
        type: 'element',
        tagName: 'div',
        properties: { foo: true },
        children: []
      },
      'should support unknown `boolean` values'
    )

    st.deepEqual(
      h(null, { class: ['bar', 'baz'] }),
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['bar', 'baz'] },
        children: []
      },
      'should support unknown `Array` values'
    )

    st.deepEqual(
      h(null, { foo: null }),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should ignore properties with a value of `null`'
    )

    st.deepEqual(
      h(null, { foo: undefined }),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should ignore properties with a value of `undefined`'
    )

    st.deepEqual(
      h(null, { foo: NaN }),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should ignore properties with a value of `NaN`'
    )

    st.deepEqual(
      h(null, { allowFullScreen: '' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { allowFullScreen: true },
        children: []
      },
      'should cast valid known `boolean` values'
    )

    st.deepEqual(
      h(null, { allowFullScreen: 'yup' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { allowFullScreen: 'yup' },
        children: []
      },
      'should not cast invalid known `boolean` values'
    )

    st.deepEqual(
      h(null, { volume: '0.1' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { volume: 0.1 },
        children: []
      },
      'should cast valid known `numeric` values'
    )

    st.deepEqual(
      h(null, { volume: 'one' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { volume: 'one' },
        children: []
      },
      'should not cast invalid known `numeric` values'
    )

    st.deepEqual(
      h(null, { download: '' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { download: true },
        children: []
      },
      'should cast known empty overloaded `boolean` values'
    )

    st.deepEqual(
      h(null, { download: 'downLOAD' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { download: true },
        children: []
      },
      'should cast known named overloaded `boolean` values'
    )

    st.deepEqual(
      h(null, { download: 'example.ogg' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { download: 'example.ogg' },
        children: []
      },
      'should not cast overloaded `boolean` values for different values'
    )

    st.deepEqual(
      h('meter', { low: '40', high: '90' }),
      {
        type: 'element',
        tagName: 'meter',
        properties: { low: 40, high: 90 },
        children: []
      },
      'should cast known `numeric` values'
    )

    st.deepEqual(
      h('a', { coords: ['0', '0', '82', '126'] }),
      {
        type: 'element',
        tagName: 'a',
        properties: { coords: [0, 0, 82, 126] },
        children: []
      },
      'should cast a list of known `numeric` values'
    )

    st.deepEqual(
      h(null, { class: 'foo bar baz' }),
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['foo', 'bar', 'baz'] },
        children: []
      },
      'should cast know space-separated `array` values'
    )

    st.deepEqual(
      h('input', { type: 'file', accept: 'video/*, image/*' }),
      {
        type: 'element',
        tagName: 'input',
        properties: { type: 'file', accept: ['video/*', 'image/*'] },
        children: []
      },
      'should cast know comma-separated `array` values'
    )

    st.deepEqual(
      h(null, { style: { color: 'red', '-webkit-border-radius': '3px' } }),
      {
        type: 'element',
        tagName: 'div',
        properties: {
          style: 'color: red; -webkit-border-radius: 3px'
        },
        children: []
      },
      'should support `style` as an object'
    )

    st.deepEqual(
      h(null, { style: 'color:/*red*/purple; -webkit-border-radius: 3px' }),
      {
        type: 'element',
        tagName: 'div',
        properties: {
          style: 'color:/*red*/purple; -webkit-border-radius: 3px'
        },
        children: []
      },
      'should support `style` as a string'
    )

    st.end()
  })

  t.test('children', function(st) {
    st.deepEqual(
      h('div', {}, []),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should ignore no children'
    )

    st.deepEqual(
      h('div', {}, 'foo'),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{ type: 'text', value: 'foo' }]
      },
      'should support `string` for a `Text`'
    )

    st.deepEqual(
      h('div', {}, { type: 'text', value: 'foo' }),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{ type: 'text', value: 'foo' }]
      },
      'should support a node'
    )

    st.deepEqual(
      h('div', {}, h('span', {}, 'foo')),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{ type: 'text', value: 'foo' }]
          }
        ]
      },
      'should support a node created by `h`'
    )

    st.deepEqual(
      h('div', {}, [
        { type: 'text', value: 'foo' },
        { type: 'text', value: 'bar' }
      ]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          { type: 'text', value: 'foo' },
          { type: 'text', value: 'bar' }
        ]
      },
      'should support nodes'
    )

    st.deepEqual(
      h('div', {}, [h('span', {}, 'foo'), h('strong', {}, 'bar')]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{ type: 'text', value: 'foo' }]
          },
          {
            type: 'element',
            tagName: 'strong',
            properties: {},
            children: [{ type: 'text', value: 'bar' }]
          }
        ]
      },
      'should support nodes created by `h`'
    )

    st.deepEqual(
      h('div', {}, ['foo', 'bar']),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          { type: 'text', value: 'foo' },
          { type: 'text', value: 'bar' }
        ]
      },
      'should support `Array.<string>` for a `Text`s'
    )

    st.deepEqual(
      h('strong', 'foo'),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{ type: 'text', value: 'foo' }]
      },
      'should allow omitting `properties` for a `string`'
    )

    st.deepEqual(
      h('strong', h('span', 'foo')),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{ type: 'text', value: 'foo' }]
          }
        ]
      },
      'should allow omitting `properties` for a node'
    )

    st.deepEqual(
      h('strong', ['foo', 'bar']),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          { type: 'text', value: 'foo' },
          { type: 'text', value: 'bar' }
        ]
      },
      'should allow omitting `properties` for an array'
    )

    st.deepEqual(
      h('input', { type: 'text', value: 'foo' }),
      {
        type: 'element',
        tagName: 'input',
        properties: { type: 'text', value: 'foo' },
        children: []
      },
      'should *not* allow omitting `properties` for ' +
        'an `input[type=text][value]`, as those are void and clash'
    )

    st.deepEqual(
      h('a', { type: 'text/html' }),
      {
        type: 'element',
        tagName: 'a',
        properties: { type: 'text/html' },
        children: []
      },
      'should *not* allow omitting `properties` for ' +
        'an `[type]`, without `value` or `children`'
    )

    st.deepEqual(
      h('foo', {
        type: 'text/html',
        children: { bar: 'baz' }
      }),
      {
        type: 'element',
        tagName: 'foo',
        properties: {
          type: 'text/html',
          children: { bar: 'baz' }
        },
        children: []
      },
      'should *not* allow omitting `properties` when ' +
        '`children` is not set to an array'
    )

    st.deepEqual(
      h('button', { type: 'submit', value: 'Send' }),
      {
        type: 'element',
        tagName: 'button',
        properties: { type: 'submit', value: 'Send' },
        children: []
      },
      'should *not* allow omitting `properties` when ' +
        'a button has a valid type'
    )

    st.deepEqual(
      h('button', { type: 'BUTTON', value: 'Send' }),
      {
        type: 'element',
        tagName: 'button',
        properties: { type: 'BUTTON', value: 'Send' },
        children: []
      },
      'should *not* allow omitting `properties` when ' +
        'a button has a valid non-lowercase type'
    )

    st.deepEqual(
      h('button', { type: 'menu', value: 'Send' }),
      {
        type: 'element',
        tagName: 'button',
        properties: { type: 'menu', value: 'Send' },
        children: []
      },
      'should *not* allow omitting `properties` when ' +
        'a button has a valid type'
    )

    st.deepEqual(
      h('button', {
        type: 'text',
        value: 'Send'
      }),
      {
        type: 'element',
        tagName: 'button',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'Send'
          }
        ]
      },
      'should allow omitting `properties` when ' +
        'a button has an invalid type'
    )

    st.throws(
      function() {
        h('foo', {}, true)
      },
      /Expected node, nodes, or string, got `true`/,
      'should throw when given an invalid value'
    )

    st.end()
  })

  t.test('<template>', function(st) {
    st.deepEqual(
      h('template'),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {
          type: 'root',
          children: []
        }
      },
      'empty template'
    )

    st.deepEqual(
      h('template', 'Alpha'),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {
          type: 'root',
          children: [{ type: 'text', value: 'Alpha' }]
        }
      },
      'template with text'
    )

    st.deepEqual(
      h('template', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {
          type: 'root',
          children: [
            {
              type: 'element',
              tagName: 'b',
              properties: {},
              children: [{ type: 'text', value: 'Bold' }]
            },
            { type: 'text', value: ' and ' },
            {
              type: 'element',
              tagName: 'i',
              properties: {},
              children: [{ type: 'text', value: 'italic' }]
            },
            { type: 'text', value: '.' }
          ]
        }
      },
      'template with elements'
    )

    st.end()
  })

  t.end()
})
