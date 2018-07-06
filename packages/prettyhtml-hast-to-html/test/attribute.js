'use strict'

var test = require('tape')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`element` attributes', function(t) {
  t.deepEqual(
    to(h('i', { className: ['alpha'] }, 'bravo')),
    '<i class="alpha">bravo</i>',
    'should stringify special camel-cased properties'
  )

  t.deepEqual(
    to(h('i', { dataFoo: 'alpha' }, 'bravo')),
    '<i dataFoo="alpha">bravo</i>',
    'should not stringify camel-cased properties'
  )

  t.deepEqual(
    to(h('i', { data123: 'alpha' }, 'bravo')),
    '<i data-123="alpha">bravo</i>',
    'should stringify numeric `data-` properties'
  )

  t.deepEqual(
    to(h('img', { alt: '' })),
    '<img alt>',
    'should not show empty string attributes'
  )

  t.deepEqual(
    to(h('img', { alt: '' }), { collapseEmptyAttributes: true }),
    '<img alt>',
    'should collapse empty string attributes in `collapseEmptyAttributes` mode'
  )

  t.deepEqual(
    to(h('i', { className: ['a', 'b'], title: 'c d' }, 'bravo')),
    '<i class="a b" title="c d">bravo</i>',
    'should stringify multiple properties'
  )

  t.deepEqual(
    to(h('i', { className: ['a', 'b'], title: 'c d' }, 'bravo'), {
      tightAttributes: true
    }),
    '<i class="a b"title="c d">bravo</i>',
    'should stringify multiple properties tightly in `tightAttributes` mode'
  )

  t.deepEqual(
    to(h('i', { className: ['alpha', 'charlie'] }, 'bravo')),
    '<i class="alpha charlie">bravo</i>',
    'should stringify space-separated attributes'
  )

  t.deepEqual(
    to(h('input', { type: 'file', accept: ['jpg', 'jpeg'] })),
    '<input type="file" accept="jpg, jpeg">',
    'should stringify comma-separated attributes'
  )

  t.deepEqual(
    to(h('input', { type: 'file', accept: ['jpg', 'jpeg'] }), {
      tightCommaSeparatedLists: true
    }),
    '<input type="file" accept="jpg,jpeg">',
    'should stringify comma-separated attributes tighly in `tightCommaSeparatedLists` mode'
  )

  t.deepEqual(
    to(h('span', { dataUnknown: ['alpha', 'bravo'] })),
    '<span dataUnknown="alpha bravo"></span>',
    'should not stringify unknown lists as space-separated'
  )

  t.deepEqual(
    to(h('i', { hidden: true }, 'bravo')),
    '<i hidden>bravo</i>',
    'should stringify known boolean attributes set to `true`'
  )

  t.deepEqual(
    to(h('select', { multiple: '' }, 'bravo')),
    '<select multiple>bravo</select>',
    'should render known standalone boolean attributes'
  )

  t.deepEqual(
    to(h('input', { multiple: '' })),
    '<input multiple>',
    'should render known standalone boolean attributes / #2'
  )

  t.deepEqual(
    to(h('input', { multiple: '' })),
    '<input multiple>',
    'should render known standalone boolean attributes / #3'
  )

  t.deepEqual(
    to(h('input', { disabled: 'test' })),
    '<input disabled="test">',
    'should preserve value of boolean attributes'
  )

  t.deepEqual(
    to(h('i', { hidden: false }, 'bravo')),
    '<i>bravo</i>',
    'should ignore known boolean attributes set to `false`'
  )

  t.deepEqual(
    to(h('i', { hidden: 1 }, 'bravo')),
    '<i hidden="1">bravo</i>',
    'should stringify truthy known boolean attributes'
  )

  t.deepEqual(
    to(h('i', { hidden: 0 }, 'bravo')),
    '<i hidden="0">bravo</i>',
    'should not interpret value in order to ignore falsey known boolean attributes'
  )

  t.deepEqual(
    to(h('i', { dataUnknown: false }, 'bravo')),
    '<i dataUnknown="false">bravo</i>',
    'should stringify unknown attributes set to `false`'
  )

  t.deepEqual(
    to(h('i', { dataUnknown: true }, 'bravo')),
    '<i dataUnknown="true">bravo</i>',
    'should stringify unknown attributes set to `true`'
  )

  t.deepEqual(
    to(h('i', { cols: 1 }, 'bravo')),
    '<i cols="1">bravo</i>',
    'should stringify positive known numeric attributes'
  )

  t.deepEqual(
    to(h('i', { cols: -1 }, 'bravo')),
    '<i cols="-1">bravo</i>',
    'should stringify negative known numeric attributes'
  )

  t.deepEqual(
    to(h('i', { cols: 0 }, 'bravo')),
    '<i cols="0">bravo</i>',
    'should stringify known numeric attributes set to `0`'
  )

  t.deepEqual(
    to(
      h(
        'i',
        {
          cols: {
            toString: function() {
              return 'yup'
            }
          }
        },
        'bravo'
      )
    ),
    '<i cols="yup">bravo</i>',
    'should stringify known numeric attributes set to non-numeric'
  )

  t.deepEqual(
    to(h('i', { id: 'alpha' }, 'bravo')),
    '<i id="alpha">bravo</i>',
    'should stringify other attributes'
  )

  t.deepEqual(
    to(h('i', { id: '' }, 'bravo')),
    '<i id>bravo</i>',
    'should stringify other falsey attributes'
  )

  t.deepEqual(
    to(h('i', { id: true }, 'bravo')),
    '<i id="true">bravo</i>',
    'should stringify other non-string attributes'
  )

  t.throws(
    function() {
      to(h('img'), { quote: '`' })
    },
    /Invalid quote ```, expected `'` or `"`/,
    'should throw on invalid quotes'
  )

  t.deepEqual(
    to(h('img', { alt: '' }), { quote: '"' }),
    '<img alt>',
    'should omit quotes when value is empty'
  )

  t.deepEqual(
    to(h('img', { alt: 'alpha' })),
    '<img alt="alpha">',
    'should quotes attribute values'
  )

  t.deepEqual(
    to(h('img', { alt: '' })),
    '<img alt>',
    'should not add `=` when omitting quotes on empty values'
  )

  t.deepEqual(
    to(h('i', { '3<5\0': 'alpha' })),
    '<i 3&#x3C;5&#x0;="alpha"></i>',
    'should encode entities in attribute names'
  )

  t.deepEqual(
    to(h('i', { title: '3<5\0' })),
    '<i title="3<5\0"></i>',
    'should not encode entities in attribute values'
  )

  t.deepEqual(
    to(h('i', { '3=5\0': 'alpha' }), { allowParseErrors: true }),
    '<i 3&#x3D;5\0="alpha"></i>',
    'should not encode characters in attribute names which cause parse errors, but work, in `allowParseErrors` mode'
  )

  t.deepEqual(
    to(h('i', { title: '3"5\0' }), { allowParseErrors: true }),
    '<i title="3"5\x00"></i>',
    'should not encode characters in attribute values which cause parse errors, but work, in `allowParseErrors` mode'
  )

  t.deepEqual(
    to(h('i', { title: "3'5" }), { allowDangerousCharacters: true }),
    '<i title="3\'5"></i>',
    'should not encode characters which cause XSS issues in older browsers, in `allowParseErrors` mode'
  )

  t.deepEqual(
    to(
      u(
        'element',
        {
          tagName: 'i',
          properties: { id: null }
        },
        [u('text', 'bravo')]
      )
    ),
    '<i>bravo</i>',
    'should ignore attributes set to `null`'
  )

  t.deepEqual(
    to(
      u(
        'element',
        {
          tagName: 'i',
          properties: { id: undefined }
        },
        [u('text', 'bravo')]
      )
    ),
    '<i>bravo</i>',
    'should ignore attributes set to `undefined`'
  )

  t.end()
})
