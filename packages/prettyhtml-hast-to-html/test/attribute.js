'use strict'

var test = require('ava')
var u = require('unist-builder')
var to = require('..')

test('unknown', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: false } }, [])),
    '<i unknown="false"></i>',
    'should not ignore unknowns set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: null } }, [])),
    '<i></i>',
    'should ignore unknowns set to `null`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: undefined } }, [])),
    '<i></i>',
    'should ignore unknowns set to `undefined`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: NaN } }, [])),
    '<i></i>',
    'should ignore unknowns set to `NaN`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: true } }, [])),
    '<i unknown="true"></i>',
    'should stringify unknowns set to `true` without value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: 'unknown' } }, [])),
    '<i unknown="unknown"></i>',
    'should stringify unknowns set to their name as their name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: ['a', 'b'] } }, [])),
    '<i unknown="a b"></i>',
    'should stringify unknown lists as space-separated'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: 1 } }, [])),
    '<i unknown="1"></i>',
    'should stringify unknowns set to an integer as it’s string version'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: 0 } }, [])),
    '<i unknown="0"></i>',
    'should stringify unknowns set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { unknown: { toString: toString } } }, [])),
    '<i unknown="yup"></i>',
    'should stringify unknowns set to objects'
  )
})

test('known booleans', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: false } }, [])),
    '<i></i>',
    'should ignore known booleans set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: 0 } }, [])),
    '<i hidden="0"></i>',
    'should not ignore falsey known booleans'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: NaN } }, [])),
    '<i></i>',
    'should ignore NaN known booleans'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: true } }, [])),
    '<i hidden></i>',
    'should stringify known booleans set to `true` without value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: 'hidden' } }, [])),
    '<i hidden="hidden"></i>',
    'should stringify known booleans set to their name with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { hidden: 1 } }, [])),
    '<i hidden="1"></i>',
    'should stringify truthy known booleans with value'
  )
})

test('known overloaded booleans', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: false } }, [])),
    '<a download="false"></a>',
    'should not ignore known overloaded booleans set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: 0 } }, [])),
    '<a download="0"></a>',
    'should not ignore falsey known overloaded booleans'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: NaN } }, [])),
    '<a></a>',
    'should ignore NaN known overloaded booleans'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: true } }, [])),
    '<a download></a>',
    'should stringify known overloaded booleans set to `true` without value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: 'download' } }, [])),
    '<a download="download"></a>',
    'should stringify known overloaded booleans set to their name with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: '' } }, [])),
    '<a download></a>',
    'should stringify known overloaded booleans set to unset property'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: 1 } }, [])),
    '<a download="1"></a>',
    'should stringify truthy known overloaded booleans with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { download: 'another' } }, [])),
    '<a download="another"></a>',
    'should stringify known overloaded booleans set to another string'
  )
})

test('known numbers', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: false } }, [])),
    '<i cols="false"></i>',
    'should not ignore known numbers set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { cols: NaN } }, [])),
    '<a></a>',
    'should ignore NaN known numbers'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: 0 } }, [])),
    '<i cols="0"></i>',
    'should stringify known numbers set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: -1 } }, [])),
    '<i cols="-1"></i>',
    'should stringify known numbers set to `-1`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: 1 } }, [])),
    '<i cols="1"></i>',
    'should stringify known numbers set to `1`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: Math.PI } }, [])),
    '<i cols="3.141592653589793"></i>',
    'should stringify known numbers set to `Math.PI`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: true } }, [])),
    '<i cols="true"></i>',
    'should stringify known numbers set to `true` as with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: '' } }, [])),
    '<i cols></i>',
    'should stringify known numbers set to an unset property'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: 'cols' } }, [])),
    '<i cols="cols"></i>',
    'should stringify known numbers set to their name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: 'another' } }, [])),
    '<i cols="another"></i>',
    'should stringify known numbers set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: { toString: toString } } }, [])),
    '<i cols="yup"></i>',
    'should stringify known numbers set to an object'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: ['a', 'b'] } }, [])),
    '<i cols="a b"></i>',
    'should stringify known numbers set to an array of strings'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: [0, 50] } }, [])),
    '<i cols="0 50"></i>',
    'should stringify known numbers set to an array of numbers'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { cols: [true, false] } }, [])),
    '<i cols="true false"></i>',
    'should stringify known numbers set to an array of booleans'
  )
})

test('known space-separated lists', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: false } }, [])),
    '<i class="false"></i>',
    'should not ignore known space-separated lists set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { className: NaN } }, [])),
    '<a></a>',
    'should ignore NaN known space-separated lists'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: 0 } }, [])),
    '<i class="0"></i>',
    'should stringify known space-separated lists set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: true } }, [])),
    '<i class="true"></i>',
    'should stringify known space-separated lists set to `true` as with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: '' } }, [])),
    '<i class></i>',
    'should stringify known space-separated lists set to an unset property'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: 'class' } }, [])),
    '<i class="class"></i>',
    'should stringify known space-separated lists set to their attribute name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: 'className' } }, [])),
    '<i class="className"></i>',
    'should stringify known space-separated lists set to their property name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: 'another' } }, [])),
    '<i class="another"></i>',
    'should stringify known space-separated lists set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: { toString: toString } } }, [])),
    '<i class="yup"></i>',
    'should stringify known space-separated lists set to an object'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: ['a', 'b'] } }, [])),
    '<i class="a b"></i>',
    'should stringify known space-separated lists set to an array of strings'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: [0, 50] } }, [])),
    '<i class="0 50"></i>',
    'should stringify known space-separated lists set to an array of numbers'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { className: [true, false] } }, [])),
    '<i class="true false"></i>',
    'should stringify known space-separated lists set to an array of booleans'
  )
})

test('known comma-separated lists', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: false } }, [])),
    '<i accept="false"></i>',
    'should not ignore known comma-separated lists set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'a', properties: { accept: NaN } }, [])),
    '<a></a>',
    'should ignore NaN known comma-separated lists'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: 0 } }, [])),
    '<i accept="0"></i>',
    'should stringify known comma-separated lists set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: true } }, [])),
    '<i accept="true"></i>',
    'should stringify known comma-separated lists set to `true` as with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: '' } }, [])),
    '<i accept></i>',
    'should stringify known comma-separated lists set to an unset attribute'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: 'accept' } }, [])),
    '<i accept="accept"></i>',
    'should stringify known comma-separated lists set to their name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: 'another' } }, [])),
    '<i accept="another"></i>',
    'should stringify known comma-separated lists set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: { toString: toString } } }, [])),
    '<i accept="yup"></i>',
    'should stringify known comma-separated lists set to an object'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: ['a', 'b'] } }, [])),
    '<i accept="a, b"></i>',
    'should stringify known comma-separated lists set to an array of strings'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: [0, 50] } }, [])),
    '<i accept="0, 50"></i>',
    'should stringify known comma-separated lists set to an array of numbers'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { accept: [true, false] } }, [])),
    '<i accept="true, false"></i>',
    'should stringify known comma-separated lists set to an array of booleans'
  )
})

test('known normals', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: false } }, [])),
    '<i id="false"></i>',
    'should not ignore known normals set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: NaN } }, [])),
    '<i></i>',
    'should ignore NaN known normals'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: 0 } }, [])),
    '<i id="0"></i>',
    'should stringify known normals set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: true } }, [])),
    '<i id="true"></i>',
    'should stringify known normals set to `true` as with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: '' } }, [])),
    '<i id></i>',
    'should stringify known normals set to an unset property'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: 'id' } }, [])),
    '<i id="id"></i>',
    'should stringify known normals set to their name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: 'another' } }, [])),
    '<i id="another"></i>',
    'should stringify known normals set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: { toString: toString } } }, [])),
    '<i id="yup"></i>',
    'should stringify known normals set to an object'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: ['a', 'b'] } }, [])),
    '<i id="a b"></i>',
    'should stringify known normals set to an array of strings as a space-separated list'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: [0, 50] } }, [])),
    '<i id="0 50"></i>',
    'should stringify known normals set to an array of numbers as a space-separated list'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { id: [true, false] } }, [])),
    '<i id="true false"></i>',
    'should stringify known normals set to an array of booleans as a space-separated list'
  )
})

test('data properties', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: false } }, [])),
    '<i data-id="false"></i>',
    'should not ignore data properties set to `false`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: NaN } }, [])),
    '<i></i>',
    'should ignore NaN data properties'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: 0 } }, [])),
    '<i data-id="0"></i>',
    'should stringify data properties set to `0`'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: true } }, [])),
    '<i data-id="true"></i>',
    'should stringify data properties set to `true` as with value'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: '' } }, [])),
    '<i data-id></i>',
    'should stringify data properties set to an unset property'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: 'dataId' } }, [])),
    '<i data-id="dataId"></i>',
    'should stringify data properties set to their property name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: 'data-id' } }, [])),
    '<i data-id="data-id"></i>',
    'should stringify data properties set to their attribute name'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: 'another' } }, [])),
    '<i data-id="another"></i>',
    'should stringify data properties set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { data123: 'a' } }, [])),
    '<i data-123="a"></i>',
    'should stringify numeric-first data properties set to a string'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: { toString: toString } } }, [])),
    '<i data-id="yup"></i>',
    'should stringify data properties set to an object'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: ['a', 'b'] } }, [])),
    '<i data-id="a b"></i>',
    'should stringify data properties set to an array of strings as a space-separated list'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: [0, 50] } }, [])),
    '<i data-id="0 50"></i>',
    'should stringify data properties set to an array of numbers as a space-separated list'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { dataId: [true, false] } }, [])),
    '<i data-id="true false"></i>',
    'should stringify data properties set to an array of booleans as a space-separated list'
  )
})

test('quote', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: 'a' } }, [])),
    '<i title="a"></i>',
    'should quote attribute values with double quotes by default'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: 'a' } }, []), {
      singleQuote: true
    }),
    "<i title='a'></i>",
    "should not quote attribute values with single quotes if `quote: '\\''`"
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: 'a' } }, []), {
      singleQuote: false
    }),
    '<i title="a"></i>',
    "should quote attribute values with double quotes if `quote: '\\\"'`"
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: "'a'" } }, []), {
      singleQuote: true
    }),
    "<i title=''a''></i>",
    "should not quote attribute values with single quotes if `quote: '\\''` even if they occur in value"
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: '"a"' } }, []), {
      singleQuote: false
    }),
    '<i title=""a""></i>',
    "should not quote attribute values with double quotes if `quote: '\\\"'` even if they occur in value"
  )
})

test('entities in attributes', function(t) {
  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { '3<5\0': 'a' } }, [])),
    '<i 3&#x3C;5&#x0;="a"></i>',
    'should encode entities in attribute names'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: '3<5\0' } }, [])),
    '<i title="3<5\0"></i>',
    'should not encode entities in attribute values'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { '3=5\0': 'a' } }, []), {
      allowParseErrors: true
    }),
    '<i 3&#x3D;5\0="a"></i>',
    'should not encode characters in attribute names which cause parse errors, but work, in `allowParseErrors` mode'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: '3=5\0' } }, []), {
      allowParseErrors: true
    }),
    '<i title="3=5\0"></i>',
    'should not encode characters in attribute values which cause parse errors, but work, in `allowParseErrors` mode'
  )

  t.deepEqual(
    to(u('element', { tagName: 'i', properties: { title: "3'5" } }, [])),
    '<i title="3\'5"></i>',
    'should not encode characters which cause XSS issues in older browsers'
  )
})

function toString() {
  return 'yup'
}
