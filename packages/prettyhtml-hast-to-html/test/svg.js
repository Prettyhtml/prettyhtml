'use strict'

var test = require('ava')
var u = require('unist-builder')
var s = require('@starptech/prettyhtml-hastscript/svg')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

test('svg', function(t) {
  t.deepEqual(to(s('path'), { space: 'svg' }), '<path></path>', 'should stringify `element`s')

  t.deepEqual(to(s('foo'), { space: 'svg' }), '<foo></foo>', 'should stringify unknown `element`s')

  t.deepEqual(
    to(s('g', s('circle')), { space: 'svg' }),
    '<g><circle></circle></g>',
    'should stringify `element`s with content'
  )

  t.deepEqual(
    to(s('circle'), { space: 'svg', closeEmptyElements: true }),
    '<circle />',
    'should stringify with ` /` in `closeEmptyElements` mode'
  )

  t.deepEqual(
    to(s('text', { dataFoo: 'alpha' }, 'bravo')),
    '<text data-foo="alpha">bravo</text>',
    'should stringify properties'
  )

  t.deepEqual(
    to(s('circle'), {
      space: 'svg',
      closeEmptyElements: true,
      tightSelfClosing: true
    }),
    '<circle/>',
    'should stringify voids with `/` in `closeEmptyElements` and `tightSelfClosing` mode'
  )

  t.deepEqual(
    to(s('text', { className: ['alpha'] }, 'bravo'), { space: 'svg' }),
    '<text class="alpha">bravo</text>',
    'should stringify special properties'
  )

  t.deepEqual(
    to(s('text', { className: ['a', 'b'], title: 'c d' }, 'bravo'), {
      space: 'svg'
    }),
    '<text class="a b" title="c d">bravo</text>',
    'should stringify multiple properties'
  )

  t.deepEqual(
    to(s('text', { className: ['a', 'b'], title: 'c d' }, 'bravo'), {
      space: 'svg',
      tightAttributes: true
    }),
    '<text class="a b" title="c d">bravo</text>',
    'should *not* stringify multiple properties tightly in `tightAttributes` mode'
  )

  t.deepEqual(
    to(s('text', { className: ['alpha', 'charlie'] }, 'bravo'), {
      space: 'svg'
    }),
    '<text class="alpha charlie">bravo</text>',
    'should stringify space-separated attributes'
  )

  t.deepEqual(
    to(s('glyph', { glyphName: ['foo', 'bar'] }), { space: 'svg' }),
    '<glyph glyph-name="foo, bar"></glyph>',
    'should stringify comma-separated attributes'
  )

  t.deepEqual(
    to(s('glyph', { glyphName: ['foo', 'bar'] }), {
      tightCommaSeparatedLists: true,
      space: 'svg'
    }),
    '<glyph glyph-name="foo,bar"></glyph>',
    'should stringify comma-separated attributes tighly in `tightCommaSeparatedLists` mode'
  )

  t.deepEqual(
    to(s('circle', { unknown: ['alpha', 'bravo'] }), { space: true }),
    '<circle unknown="alpha bravo"></circle>',
    'should stringify unknown lists as space-separated'
  )

  t.deepEqual(
    to(s('a', { download: true }, 'bravo'), { space: 'svg' }),
    '<a download>bravo</a>',
    'should stringify known boolean attributes set to `true`'
  )

  t.deepEqual(
    to(s('a', { download: false }, 'bravo'), { space: 'svg' }),
    '<a>bravo</a>',
    'should ignore known boolean attributes set to `false`'
  )

  t.deepEqual(
    to(s('a', { download: 1 }, 'bravo'), { space: 'svg' }),
    '<a download="1">bravo</a>',
    'should stringify raw value'
  )

  t.deepEqual(
    to(s('a', { download: 0 }, 'bravo'), { space: 'svg' }),
    '<a download="0">bravo</a>',
    'should not ignore falsey known boolean attributes'
  )

  t.deepEqual(
    to(s('a', { unknown: false }, 'bravo'), { space: 'svg' }),
    '<a unknown="false">bravo</a>',
    'should not ignore unknown attributes set to `false`'
  )

  t.deepEqual(
    to(s('a', { unknown: true }, 'bravo'), { space: 'svg' }),
    '<a unknown="true">bravo</a>',
    'should stringify unknown attributes set to raw value'
  )

  t.deepEqual(
    to(s('path', { strokeOpacity: 0.7 }), { space: 'svg' }),
    '<path stroke-opacity="0.7"></path>',
    'should stringify positive known numeric attributes'
  )

  t.deepEqual(
    to(s('path', { strokeMiterLimit: -1 }), { space: 'svg' }),
    '<path stroke-miterlimit="-1"></path>',
    'should stringify negative known numeric attributes'
  )

  t.deepEqual(
    to(s('path', { strokeOpacity: 0 }), { space: 'svg' }),
    '<path stroke-opacity="0"></path>',
    'should stringify known numeric attributes set to `0`'
  )

  t.deepEqual(
    to(s('path', { strokeOpacity: NaN }), { space: 'svg' }),
    '<path></path>',
    'should ignore known numeric attributes set to `NaN`'
  )

  t.deepEqual(
    to(s('path', { strokeOpacity: { toString: toString } }), { space: 'svg' }),
    '<path stroke-opacity="yup"></path>',
    'should stringify known numeric attributes set to non-numeric values'
  )

  t.deepEqual(
    to(s('svg', { viewBox: '0 0 10 10' }), { space: 'svg' }),
    '<svg viewBox="0 0 10 10"></svg>',
    'should stringify other attributes'
  )

  t.deepEqual(
    to(s('svg', { viewBox: '' }), { space: 'svg' }),
    '<svg viewBox></svg>',
    'should stringify other falsey attributes'
  )

  t.deepEqual(
    to(s('i', { id: true }, 'bravo'), { space: 'svg' }),
    '<i id="true">bravo</i>',
    'should stringify other non-string attributes'
  )

  t.deepEqual(
    to(s('svg', { viewBox: '0 0 10 10' }), { space: 'svg', singleQuote: true }),
    "<svg viewBox='0 0 10 10'></svg>",
    'should quote attribute values with single quotes if `quote: "\'"`'
  )

  t.deepEqual(
    to(s('svg', { viewBox: '0 0 10 10' }), {
      space: 'svg',
      singleQuote: false
    }),
    '<svg viewBox="0 0 10 10"></svg>',
    "should quote attribute values with double quotes if `quote: '\"'`"
  )

  t.deepEqual(
    to(s('circle', { '3<5\0': 'alpha' }), { space: 'svg' }),
    '<circle 3&#x3C;5&#x0;="alpha"></circle>',
    'should encode entities in attribute names'
  )

  t.deepEqual(
    to(s('circle', { title: '3<5\0' }), { space: 'svg' }),
    '<circle title="3<5\0"></circle>',
    'should not encode entities in attribute values'
  )

  t.deepEqual(
    to(s('circle', { '3=5\0': 'alpha' }), {
      space: 'svg',
      allowParseErrors: true
    }),
    '<circle 3&#x3D;5&#x0;="alpha"></circle>',
    '*should* encode characters in attribute names which cause parse errors, work, even though `allowParseErrors` mode is on'
  )

  t.deepEqual(
    to(s('circle', { title: '3"5\0' }), {
      space: 'svg',
      allowParseErrors: true
    }),
    '<circle title="3"5\0"></circle>',
    '*should* not encode characters in attribute values which cause parse errors, work, even though `allowParseErrors` mode is on'
  )

  t.deepEqual(
    to(s('circle', { title: "3'5" }), {
      space: 'svg'
    }),
    '<circle title="3\'5"></circle>',
    'should not encode characters which cause XSS issues in older browsers'
  )

  t.deepEqual(
    to(u('element', { tagName: 'circle', properties: { id: null } }, [])),
    '<circle></circle>',
    'should ignore attributes set to `null`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'circle', properties: { id: undefined } }, [])),
    '<circle></circle>',
    'should ignore attributes set to `undefined`'
  )

  t.deepEqual(
    to(
      s(
        'svg',
        {
          xlmns: 'http://www.w3.org/2000/svg',
          xmlnsXLink: 'http://www.w3.org/1999/xlink',
          width: 500,
          height: 500,
          viewBox: [0, 0, 500, 500]
        },
        [s('title', 'SVG `<circle>` element'), s('circle', { cx: 120, cy: 120, r: 100 })]
      ),
      { space: 'svg' }
    ),
    [
      '<svg xlmns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500">',
      '<title>SVG `<circle>` element</title>',
      '<circle cx="120" cy="120" r="100"></circle>',
      '</svg>'
    ].join(''),
    'should stringify an SVG tree without encoding'
  )

  t.deepEqual(
    to(
      u('root', [
        u('doctype', { name: 'html' }),
        h('head', h('title', 'The SVG `<circle>` element')),
        h('body', [
          s(
            'svg',
            { xlmns: 'http://www.w3.org/2000/svg', viewbox: [0, 0, 500, 500] },
            s('circle', { cx: 120, cy: 120, r: 100 })
          )
        ])
      ])
    ),
    [
      '<!doctype html>',
      '<head><title>The SVG `<circle>` element</title></head>',
      '<body>',
      '<svg xlmns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">',
      '<circle cx="120" cy="120" r="100"></circle>',
      '</svg>',
      '</body>'
    ].join(''),
    'should stringify an HTML tree with embedded HTML'
  )
})

function toString() {
  return 'yup'
}
