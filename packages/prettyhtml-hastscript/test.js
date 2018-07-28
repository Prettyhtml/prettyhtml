'use strict'

var test = require('tape')
var s = require('./svg')
var h = require('./html')

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
      h('.bar', {class: 'baz'}),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['bar', 'baz']},
        children: []
      },
      'should append to the selector’s classes'
    )

    st.deepEqual(
      h('#id'),
      {
        type: 'element',
        tagName: 'div',
        properties: {id: 'id'},
        children: []
      },
      'should create a `div` element when given an id selector'
    )

    st.deepEqual(
      h('#a#b'),
      {
        type: 'element',
        tagName: 'div',
        properties: {id: 'b'},
        children: []
      },
      'should create an element with the last ID when given multiple in a selector'
    )

    st.deepEqual(
      h('.foo'),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo']},
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
        properties: {id: 'bar'},
        children: []
      },
      'should create a `foo` element with an ID when given a both as a selector'
    )

    st.deepEqual(
      h('foo.bar'),
      {
        type: 'element',
        tagName: 'foo',
        properties: {className: ['bar']},
        children: []
      },
      'should create a `foo` element with a class when given a both as a selector'
    )

    st.deepEqual(
      h('.foo.bar'),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo', 'bar']},
        children: []
      },
      'should support multiple classes'
    )

    st.end()
  })

  t.test('properties', function(st) {
    st.test('known property names', function(sst) {
      sst.deepEqual(
        h(null, {className: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should support correctly cased property names'
      )

      sst.deepEqual(
        h(null, {class: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should map attributes to property names'
      )

      sst.deepEqual(
        h(null, {CLASS: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should map attribute-like values to property names'
      )

      sst.deepEqual(
        h(null, {'class-name': 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should map property-like values to property names'
      )

      sst.end()
    })

    st.test('unknown property names', function(sst) {
      sst.deepEqual(
        h(null, {allowbigscreen: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowbigscreen: true},
          children: []
        },
        'should keep lower-cased unknown names'
      )

      sst.deepEqual(
        h(null, {allowBigScreen: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowBigScreen: true},
          children: []
        },
        'should keep camel-cased unknown names'
      )

      sst.deepEqual(
        h(null, {'allow_big-screen': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'allow_big-screen': true},
          children: []
        },
        'should keep weirdly cased unknown names'
      )

      sst.end()
    })

    st.test('other namespaces', function(sst) {
      sst.deepEqual(
        h(null, {'aria-valuenow': 1}),
        {
          type: 'element',
          tagName: 'div',
          properties: {ariaValueNow: 1},
          children: []
        },
        'should support aria attribute names'
      )

      sst.deepEqual(
        h(null, {ariaValueNow: 1}),
        {
          type: 'element',
          tagName: 'div',
          properties: {ariaValueNow: 1},
          children: []
        },
        'should support aria property names'
      )

      sst.deepEqual(
        s(null, {'color-interpolation-filters': 'sRGB'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {colorInterpolationFilters: 'sRGB'},
          children: []
        },
        'should support svg attribute names'
      )

      sst.deepEqual(
        s(null, {colorInterpolationFilters: 'sRGB'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {colorInterpolationFilters: 'sRGB'},
          children: []
        },
        'should support svg property names'
      )

      sst.deepEqual(
        s(null, {'xml:space': 'preserve'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlSpace: 'preserve'},
          children: []
        },
        'should support xml attribute names'
      )

      sst.deepEqual(
        s(null, {xmlSpace: 'preserve'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlSpace: 'preserve'},
          children: []
        },
        'should support xml property names'
      )

      sst.deepEqual(
        s(null, {'xmlns:xlink': 'http://www.w3.org/1999/xlink'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
          children: []
        },
        'should support xmlns attribute names'
      )

      sst.deepEqual(
        s(null, {xmlnsXLink: 'http://www.w3.org/1999/xlink'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
          children: []
        },
        'should support xmlns property names'
      )

      sst.deepEqual(
        s(null, {'xlink:arcrole': 'http://www.example.com'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xLinkArcRole: 'http://www.example.com'},
          children: []
        },
        'should support xlink attribute names'
      )

      sst.deepEqual(
        s(null, {xLinkArcRole: 'http://www.example.com'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xLinkArcRole: 'http://www.example.com'},
          children: []
        },
        'should support xlink property names'
      )

      sst.end()
    })

    st.test('data property names', function(sst) {
      sst.deepEqual(
        h(null, {'data-foo': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {dataFoo: true},
          children: []
        },
        'should support data attribute names'
      )

      sst.deepEqual(
        h(null, {'data-123': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {data123: true},
          children: []
        },
        'should support numeric-first data attribute names'
      )

      sst.deepEqual(
        h(null, {dataFooBar: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {dataFooBar: true},
          children: []
        },
        'should support data property names'
      )

      sst.deepEqual(
        h(null, {data123: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {data123: true},
          children: []
        },
        'should support numeric-first data property names'
      )

      sst.deepEqual(
        h(null, {'data-foo.bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo.bar': true},
          children: []
        },
        'should support data attribute names with uncommon characters'
      )

      sst.deepEqual(
        h(null, {'dataFoo.bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo.bar': true},
          children: []
        },
        'should support data property names with uncommon characters'
      )

      sst.deepEqual(
        h(null, {'data-foo!bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'data-foo!bar': true},
          children: []
        },
        'should keep invalid data attribute names'
      )

      sst.deepEqual(
        h(null, {'dataFoo!bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo!bar': true},
          children: []
        },
        'should keep invalid data property names'
      )

      sst.end()
    })

    st.test('unknown property values', function(sst) {
      sst.deepEqual(
        h(null, {foo: 'bar'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: 'bar'},
          children: []
        },
        'should support unknown `string` values'
      )

      sst.deepEqual(
        h(null, {foo: 3}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: 3},
          children: []
        },
        'should support unknown `number` values'
      )

      sst.deepEqual(
        h(null, {foo: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: true},
          children: []
        },
        'should support unknown `boolean` values'
      )

      sst.deepEqual(
        h(null, {list: ['bar', 'baz']}),
        {
          type: 'element',
          tagName: 'div',
          properties: {list: ['bar', 'baz']},
          children: []
        },
        'should support unknown `Array` values'
      )

      sst.deepEqual(
        h(null, {foo: null}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `null`'
      )

      sst.deepEqual(
        h(null, {foo: undefined}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `undefined`'
      )

      sst.deepEqual(
        h(null, {foo: NaN}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `NaN`'
      )

      sst.end()
    })

    st.test('known booleans', function(sst) {
      sst.deepEqual(
        h(null, {allowFullScreen: ''}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowFullScreen: true},
          children: []
        },
        'should cast valid known `boolean` values'
      )

      sst.deepEqual(
        h(null, {allowFullScreen: 'yup'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowFullScreen: 'yup'},
          children: []
        },
        'should not cast invalid known `boolean` values'
      )

      sst.deepEqual(
        h('img', {title: 'title'}),
        {
          type: 'element',
          tagName: 'img',
          properties: {title: 'title'},
          children: []
        },
        'should not cast unknown boolean-like values'
      )

      sst.end()
    })

    st.test('known overloaded booleans', function(sst) {
      sst.deepEqual(
        h(null, {download: ''}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: true},
          children: []
        },
        'should cast known empty overloaded `boolean` values'
      )

      sst.deepEqual(
        h(null, {download: 'downLOAD'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: true},
          children: []
        },
        'should cast known named overloaded `boolean` values'
      )

      st.deepEqual(
        h(null, {download: 'example.ogg'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: 'example.ogg'},
          children: []
        },
        'should not cast overloaded `boolean` values for different values'
      )

      sst.end()
    })

    st.test('known numbers', function(sst) {
      sst.deepEqual(
        h('textarea', {cols: '3'}),
        {
          type: 'element',
          tagName: 'textarea',
          properties: {cols: 3},
          children: []
        },
        'should cast valid known `numeric` values'
      )

      sst.deepEqual(
        h('textarea', {cols: 'one'}),
        {
          type: 'element',
          tagName: 'textarea',
          properties: {cols: 'one'},
          children: []
        },
        'should not cast invalid known `numeric` values'
      )

      sst.deepEqual(
        h('meter', {low: '40', high: '90'}),
        {
          type: 'element',
          tagName: 'meter',
          properties: {low: 40, high: 90},
          children: []
        },
        'should cast known `numeric` values'
      )

      sst.end()
    })

    st.test('known lists', function(sst) {
      sst.deepEqual(
        h(null, {class: 'foo bar baz'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo', 'bar', 'baz']},
          children: []
        },
        'should cast know space-separated `array` values'
      )

      sst.deepEqual(
        h('input', {type: 'file', accept: 'video/*, image/*'}),
        {
          type: 'element',
          tagName: 'input',
          properties: {type: 'file', accept: ['video/*', 'image/*']},
          children: []
        },
        'should cast know comma-separated `array` values'
      )

      sst.deepEqual(
        h('a', {coords: ['0', '0', '82', '126']}),
        {
          type: 'element',
          tagName: 'a',
          properties: {coords: [0, 0, 82, 126]},
          children: []
        },
        'should cast a list of known `numeric` values'
      )

      sst.end()
    })

    st.test('style', function(sst) {
      sst.deepEqual(
        h(null, {style: {color: 'red', '-webkit-border-radius': '3px'}}),
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

      sst.deepEqual(
        h(null, {style: 'color:/*red*/purple; -webkit-border-radius: 3px'}),
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

      sst.end()
    })

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
        children: [{type: 'text', value: 'foo'}]
      },
      'should support `string` for a `Text`'
    )

    st.deepEqual(
      h('div', {}, {type: 'text', value: 'foo'}),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
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
            children: [{type: 'text', value: 'foo'}]
          }
        ]
      },
      'should support a node created by `h`'
    )

    st.deepEqual(
      h('div', {}, [
        {type: 'text', value: 'foo'},
        {type: 'text', value: 'bar'}
      ]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{type: 'text', value: 'foo'}, {type: 'text', value: 'bar'}]
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
            children: [{type: 'text', value: 'foo'}]
          },
          {
            type: 'element',
            tagName: 'strong',
            properties: {},
            children: [{type: 'text', value: 'bar'}]
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
        children: [{type: 'text', value: 'foo'}, {type: 'text', value: 'bar'}]
      },
      'should support `Array.<string>` for a `Text`s'
    )

    st.deepEqual(
      h('strong', 'foo'),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
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
            children: [{type: 'text', value: 'foo'}]
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
        children: [{type: 'text', value: 'foo'}, {type: 'text', value: 'bar'}]
      },
      'should allow omitting `properties` for an array'
    )

    st.deepEqual(
      h('input', {type: 'text', value: 'foo'}),
      {
        type: 'element',
        tagName: 'input',
        properties: {type: 'text', value: 'foo'},
        children: []
      },
      'should *not* allow omitting `properties` for an `input[type=text][value]`, as those are void and clash'
    )

    st.deepEqual(
      h('a', {type: 'text/html'}),
      {
        type: 'element',
        tagName: 'a',
        properties: {type: 'text/html'},
        children: []
      },
      'should *not* allow omitting `properties` for a `[type]`, without `value` or `children`'
    )

    st.deepEqual(
      h('foo', {type: 'text/html', children: {bar: 'baz'}}),
      {
        type: 'element',
        tagName: 'foo',
        properties: {type: 'text/html', children: {bar: 'baz'}},
        children: []
      },
      'should *not* allow omitting `properties` when `children` is not set to an array'
    )

    st.deepEqual(
      h('button', {type: 'submit', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'submit', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid type'
    )

    st.deepEqual(
      h('button', {type: 'BUTTON', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'BUTTON', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid non-lowercase type'
    )

    st.deepEqual(
      h('button', {type: 'menu', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'menu', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid type'
    )

    st.deepEqual(
      h('button', {type: 'text', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {},
        children: [{type: 'text', value: 'Send'}]
      },
      'should allow omitting `properties` when a button has an invalid type'
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
        content: {type: 'root', children: []}
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
        content: {type: 'root', children: [{type: 'text', value: 'Alpha'}]}
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
              children: [{type: 'text', value: 'Bold'}]
            },
            {type: 'text', value: ' and '},
            {
              type: 'element',
              tagName: 'i',
              properties: {},
              children: [{type: 'text', value: 'italic'}]
            },
            {type: 'text', value: '.'}
          ]
        }
      },
      'template with elements'
    )

    st.end()
  })

  t.test('svg', function(st) {
    st.deepEqual(
      s(),
      {
        type: 'element',
        tagName: 'g',
        properties: {},
        children: []
      },
      'should create a `g` element without arguments'
    )

    st.deepEqual(
      s(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          viewBox: '0 0 500 500',
          height: '500',
          width: '500'
        },
        [
          s('title', 'SVG `<circle>` element'),
          s('circle', {cx: '120', cy: '120', r: '100'})
        ]
      ),
      {
        type: 'element',
        tagName: 'svg',
        properties: {
          xmlns: 'http://www.w3.org/2000/svg',
          xmlnsXLink: 'http://www.w3.org/1999/xlink',
          viewBox: '0 0 500 500',
          height: '500',
          width: '500'
        },
        children: [
          {
            type: 'element',
            tagName: 'title',
            properties: {},
            children: [{type: 'text', value: 'SVG `<circle>` element'}]
          },
          {
            type: 'element',
            tagName: 'circle',
            properties: {cx: '120', cy: '120', r: '100'},
            children: []
          }
        ]
      },
      'should support trees'
    )

    st.deepEqual(
      s('circle', {class: 'foo bar'}),
      {
        type: 'element',
        tagName: 'circle',
        properties: {className: ['foo', 'bar']},
        children: []
      },
      'should cast valid known space-separated values'
    )

    st.deepEqual(
      s('glyph', {'glyph-name': 'foo, bar'}),
      {
        type: 'element',
        tagName: 'glyph',
        properties: {glyphName: ['foo', 'bar']},
        children: []
      },
      'should cast valid known comma-separated values'
    )

    st.deepEqual(
      s('rect', {
        requiredFeatures:
          'http://www.w3.org/TR/SVG11/feature#SVG, http://www.w3.org/TR/SVG11/feature#SVGDOM http://www.w3.org/TR/SVG11/feature#SVG-static'
      }),
      {
        type: 'element',
        tagName: 'rect',
        properties: {
          requiredFeatures: [
            'http://www.w3.org/TR/SVG11/feature#SVG',
            'http://www.w3.org/TR/SVG11/feature#SVGDOM',
            'http://www.w3.org/TR/SVG11/feature#SVG-static'
          ]
        },
        children: []
      },
      'should cast valid known comma- or space-separated values'
    )

    st.deepEqual(
      s('path', {'stroke-opacity': '0.7'}),
      {
        type: 'element',
        tagName: 'path',
        properties: {strokeOpacity: 0.7},
        children: []
      },
      'should cast valid known numeric values'
    )

    st.deepEqual(
      s('path', {'stroke-miterlimit': '1'}),
      {
        type: 'element',
        tagName: 'path',
        properties: {strokeMiterLimit: 1},
        children: []
      },
      'should cast valid known positive numeric values'
    )

    st.end()
  })

  t.end()
})
