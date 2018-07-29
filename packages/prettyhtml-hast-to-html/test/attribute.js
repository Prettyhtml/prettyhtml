'use strict'

var test = require('tape')
var h = require('@starptech/prettyhtml-hastscript')
var u = require('unist-builder')
var to = require('..')

test('`element` attributes', function(t) {
  t.test('unknown', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: false } }, [])),
      '<i></i>',
      'should ignore unknowns set to `false`'
    )

    t.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: null } }, [])),
      '<i></i>',
      'should ignore unknowns set to `null`'
    )

    t.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { unknown: undefined } }, [])
      ),
      '<i></i>',
      'should ignore unknowns set to `undefined`'
    )

    t.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: NaN } }, [])),
      '<i></i>',
      'should ignore unknowns set to `NaN`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: true } }, [])),
      '<i unknown></i>',
      'should stringify unknowns set to `true` without value'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { unknown: 'unknown' } }, [])
      ),
      '<i unknown="unknown"></i>',
      'should stringify unknowns set to their name as their name'
    )

    t.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { unknown: ['a', 'b'] } }, [])
      ),
      '<i unknown="a b"></i>',
      'should stringify unknown lists as space-separated'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: 1 } }, [])),
      '<i unknown="1"></i>',
      'should stringify unknowns set to an integer as it’s string version'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { unknown: 0 } }, [])),
      '<i unknown="0"></i>',
      'should stringify unknowns set to `0`'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { unknown: { toString: toString } } },
          []
        )
      ),
      '<i unknown="yup"></i>',
      'should stringify unknowns set to objects'
    )

    st.end()
  })

  t.test('known booleans', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: false } }, [])),
      '<i></i>',
      'should ignore known booleans set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: 0 } }, [])),
      '<i></i>',
      'should ignore falsey known booleans'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: NaN } }, [])),
      '<i></i>',
      'should ignore NaN known booleans'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: true } }, [])),
      '<i hidden></i>',
      'should stringify known booleans set to `true` without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: 'hidden' } }, [])),
      '<i hidden></i>',
      'should stringify known booleans set to their name without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { hidden: 1 } }, [])),
      '<i hidden></i>',
      'should stringify truthy known booleans without value'
    )

    st.end()
  })

  t.test('known overloaded booleans', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: false } }, [])),
      '<a></a>',
      'should ignore known overloaded booleans set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: 0 } }, [])),
      '<a></a>',
      'should ignore falsey known overloaded booleans'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: NaN } }, [])),
      '<a></a>',
      'should ignore NaN known overloaded booleans'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: true } }, [])),
      '<a download></a>',
      'should stringify known overloaded booleans set to `true` without value'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'a', properties: { download: 'download' } }, [])
      ),
      '<a download></a>',
      'should stringify known overloaded booleans set to their name without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: '' } }, [])),
      '<a download></a>',
      'should stringify known overloaded booleans set to an empty string without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { download: 1 } }, [])),
      '<a download></a>',
      'should stringify truthy known overloaded booleans without value'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'a', properties: { download: 'another' } }, [])
      ),
      '<a download="another"></a>',
      'should stringify known overloaded booleans set to another string'
    )

    st.end()
  })

  t.test('known numbers', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: false } }, [])),
      '<i></i>',
      'should ignore known numbers set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { cols: NaN } }, [])),
      '<a></a>',
      'should ignore NaN known numbers'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: 0 } }, [])),
      '<i cols="0"></i>',
      'should stringify known numbers set to `0`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: -1 } }, [])),
      '<i cols="-1"></i>',
      'should stringify known numbers set to `-1`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: 1 } }, [])),
      '<i cols="1"></i>',
      'should stringify known numbers set to `1`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: Math.PI } }, [])),
      '<i cols="3.141592653589793"></i>',
      'should stringify known numbers set to `Math.PI`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: true } }, [])),
      '<i cols></i>',
      'should stringify known numbers set to `true` as without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: '' } }, [])),
      '<i cols=""></i>',
      'should stringify known numbers set to an empty string'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: 'cols' } }, [])),
      '<i cols="cols"></i>',
      'should stringify known numbers set to their name'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { cols: 'another' } }, [])),
      '<i cols="another"></i>',
      'should stringify known numbers set to a string'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { cols: { toString: toString } } },
          []
        )
      ),
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
      to(
        u('element', { tagName: 'i', properties: { cols: [true, false] } }, [])
      ),
      '<i cols="true false"></i>',
      'should stringify known numbers set to an array of booleans'
    )

    st.end()
  })

  t.test('known space-separated lists', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { className: false } }, [])),
      '<i></i>',
      'should ignore known space-separated lists set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { className: NaN } }, [])),
      '<a></a>',
      'should ignore NaN known space-separated lists'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { className: 0 } }, [])),
      '<i class="0"></i>',
      'should stringify known space-separated lists set to `0`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { className: true } }, [])),
      '<i class></i>',
      'should stringify known space-separated lists set to `true` as without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { className: '' } }, [])),
      '<i class=""></i>',
      'should stringify known space-separated lists set to an empty string'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { className: 'class' } }, [])
      ),
      '<i class="class"></i>',
      'should stringify known space-separated lists set to their attribute name'
    )

    st.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { className: 'className' } },
          []
        )
      ),
      '<i class="className"></i>',
      'should stringify known space-separated lists set to their property name'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { className: 'another' } }, [])
      ),
      '<i class="another"></i>',
      'should stringify known space-separated lists set to a string'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { className: { toString: toString } } },
          []
        )
      ),
      '<i class="yup"></i>',
      'should stringify known space-separated lists set to an object'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { className: ['a', 'b'] } },
          []
        )
      ),
      '<i class="a b"></i>',
      'should stringify known space-separated lists set to an array of strings'
    )

    t.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { className: [0, 50] } }, [])
      ),
      '<i class="0 50"></i>',
      'should stringify known space-separated lists set to an array of numbers'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { className: [true, false] } },
          []
        )
      ),
      '<i class="true false"></i>',
      'should stringify known space-separated lists set to an array of booleans'
    )

    st.end()
  })

  t.test('known comma-separated lists', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: false } }, [])),
      '<i></i>',
      'should ignore known comma-separated lists set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'a', properties: { accept: NaN } }, [])),
      '<a></a>',
      'should ignore NaN known comma-separated lists'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: 0 } }, [])),
      '<i accept="0"></i>',
      'should stringify known comma-separated lists set to `0`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: true } }, [])),
      '<i accept></i>',
      'should stringify known comma-separated lists set to `true` as without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: '' } }, [])),
      '<i accept=""></i>',
      'should stringify known comma-separated lists set to an empty string'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: 'accept' } }, [])),
      '<i accept="accept"></i>',
      'should stringify known comma-separated lists set to their name'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: 'another' } }, [])),
      '<i accept="another"></i>',
      'should stringify known comma-separated lists set to a string'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { accept: { toString: toString } } },
          []
        )
      ),
      '<i accept="yup"></i>',
      'should stringify known comma-separated lists set to an object'
    )

    t.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { accept: ['a', 'b'] } }, [])
      ),
      '<i accept="a, b"></i>',
      'should stringify known comma-separated lists set to an array of strings'
    )

    t.deepEqual(
      to(u('element', { tagName: 'i', properties: { accept: [0, 50] } }, [])),
      '<i accept="0, 50"></i>',
      'should stringify known comma-separated lists set to an array of numbers'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { accept: [true, false] } },
          []
        )
      ),
      '<i accept="true, false"></i>',
      'should stringify known comma-separated lists set to an array of booleans'
    )

    st.end()
  })

  t.test('known normals', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: false } }, [])),
      '<i></i>',
      'should ignore known normals set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: NaN } }, [])),
      '<i></i>',
      'should ignore NaN known normals'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: 0 } }, [])),
      '<i id="0"></i>',
      'should stringify known normals set to `0`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: true } }, [])),
      '<i id></i>',
      'should stringify known normals set to `true` as without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: '' } }, [])),
      '<i id=""></i>',
      'should stringify known normals set to an empty string'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: 'id' } }, [])),
      '<i id="id"></i>',
      'should stringify known normals set to their name'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: 'another' } }, [])),
      '<i id="another"></i>',
      'should stringify known normals set to a string'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { id: { toString: toString } } },
          []
        )
      ),
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

    st.end()
  })

  t.test('data properties', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: false } }, [])),
      '<i></i>',
      'should ignore data properties set to `false`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: NaN } }, [])),
      '<i></i>',
      'should ignore NaN data properties'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: 0 } }, [])),
      '<i data-id="0"></i>',
      'should stringify data properties set to `0`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: true } }, [])),
      '<i data-id></i>',
      'should stringify data properties set to `true` as without value'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: '' } }, [])),
      '<i data-id=""></i>',
      'should stringify data properties set to an empty string'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: 'dataId' } }, [])),
      '<i data-id="dataId"></i>',
      'should stringify data properties set to their property name'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: 'data-id' } }, [])),
      '<i data-id="data-id"></i>',
      'should stringify data properties set to their attribute name'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: 'another' } }, [])),
      '<i data-id="another"></i>',
      'should stringify data properties set to a string'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { data123: 'a' } }, [])),
      '<i data-123="a"></i>',
      'should stringify numeric-first data properties set to a string'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { dataId: { toString: toString } } },
          []
        )
      ),
      '<i data-id="yup"></i>',
      'should stringify data properties set to an object'
    )

    t.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { dataId: ['a', 'b'] } }, [])
      ),
      '<i data-id="a b"></i>',
      'should stringify data properties set to an array of strings as a space-separated list'
    )

    t.deepEqual(
      to(u('element', { tagName: 'i', properties: { dataId: [0, 50] } }, [])),
      '<i data-id="0 50"></i>',
      'should stringify data properties set to an array of numbers as a space-separated list'
    )

    t.deepEqual(
      to(
        u(
          'element',
          { tagName: 'i', properties: { dataId: [true, false] } },
          []
        )
      ),
      '<i data-id="true false"></i>',
      'should stringify data properties set to an array of booleans as a space-separated list'
    )

    st.end()
  })

  t.test('collapseEmptyAttributes', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: '' } }, [])),
      '<i id=""></i>',
      'should show empty string attributes'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: '' } }, []), {
        collapseEmptyAttributes: true
      }),
      '<i id></i>',
      'should collapse empty string attributes in `collapseEmptyAttributes` mode'
    )

    st.end()
  })

  t.test('tightAttributes', function(st) {
    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { title: 'a', id: 'b' } }, [])
      ),
      '<i title="a" id="b"></i>',
      'should stringify multiple properties'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { title: 'a', id: 'b' } }, []),
        {
          tightAttributes: true
        }
      ),
      '<i title="a"id="b"></i>',
      'should stringify multiple properties tightly in `tightAttributes` mode'
    )

    st.end()
  })

  t.test('tightCommaSeparatedLists', function(st) {
    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { accept: ['a', 'b'] } }, [])
      ),
      '<i accept="a, b"></i>',
      'should stringify comma-separated attributes'
    )

    st.deepEqual(
      to(
        u('element', { tagName: 'i', properties: { accept: ['a', 'b'] } }, []),
        {
          tightCommaSeparatedLists: true
        }
      ),
      '<i accept="a,b"></i>',
      'should stringify comma-separated attributes tighly in `tightCommaSeparatedLists` mode'
    )

    st.end()
  })

  t.test('quote', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: 'a' } }, [])),
      '<i title="a"></i>',
      'should quote attribute values with double quotes by default'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: 'a' } }, []), {
        quote: "'"
      }),
      "<i title='a'></i>",
      "should quote attribute values with single quotes if `quote: '\\''`"
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: 'a' } }, []), {
        quote: '"'
      }),
      '<i title="a"></i>',
      "should quote attribute values with double quotes if `quote: '\\\"'`"
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: "'a'" } }, []), {
        quote: "'"
      }),
      "<i title='&#x27;a&#x27;'></i>",
      "should quote attribute values with single quotes if `quote: '\\''` even if they occur in value"
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '"a"' } }, []), {
        quote: '"'
      }),
      '<i title="&#x22;a&#x22;"></i>',
      "should quote attribute values with double quotes if `quote: '\\\"'` even if they occur in value"
    )

    st.throws(
      function() {
        to(h('img'), { quote: '`' })
      },
      /Invalid quote ```, expected `'` or `"`/,
      'should throw on invalid quotes'
    )

    st.end()
  })

  t.test('quoteSmart', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: 'a' } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title="a"></i>',
      'should quote attribute values with primary quotes by default'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: "'a'" } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title="\'a\'"></i>',
      'should quote attribute values with primary quotes if the alternative occurs'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: "'\"a'" } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title="\'&#x22;a\'"></i>',
      'should quote attribute values with primary quotes if they occur less than the alternative'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '"a\'' } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title="&#x22;a\'"></i>',
      'should quote attribute values with primary quotes if they occur as much as alternatives (#1)'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '"\'a\'"' } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title="&#x22;\'a\'&#x22;"></i>',
      'should quote attribute values with primary quotes if they occur as much as alternatives (#1)'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '"a"' } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title=\'"a"\'></i>',
      'should quote attribute values with alternative quotes if the primary occurs'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '"\'a"' } }, []), {
        allowDangerousCharacters: true,
        quoteSmart: true
      }),
      '<i title=\'"&#x27;a"\'></i>',
      'should quote attribute values with alternative quotes if they occur less than the primary'
    )

    st.end()
  })

  t.test('preferUnquoted', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: 'a' } }, []), {
        preferUnquoted: true
      }),
      '<i id=a></i>',
      'should omit quotes in `preferUnquoted`'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: 'a b' } }, []), {
        preferUnquoted: true
      }),
      '<i id="a b"></i>',
      'should keep quotes in `preferUnquoted` and impossible'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { id: '' } }, []), {
        preferUnquoted: true
      }),
      '<i id></i>',
      'should not add `=` when omitting quotes on empty values'
    )

    st.end()
  })

  t.test('entities in attributes', function(st) {
    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { '3<5\0': 'a' } }, [])),
      '<i 3&#x3C;5&#x0;="a"></i>',
      'should encode entities in attribute names'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '3<5\0' } }, [])),
      '<i title="3<5&#x0;"></i>',
      'should encode entities in attribute values'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { '3=5\0': 'a' } }, []), {
        allowParseErrors: true
      }),
      '<i 3&#x3D;5\0="a"></i>',
      'should not encode characters in attribute names which cause parse errors, but work, in `allowParseErrors` mode'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: '3=5\0' } }, []), {
        allowParseErrors: true
      }),
      '<i title="3=5\0"></i>',
      'should not encode characters in attribute values which cause parse errors, but work, in `allowParseErrors` mode'
    )

    st.deepEqual(
      to(u('element', { tagName: 'i', properties: { title: "3'5" } }, []), {
        allowDangerousCharacters: true
      }),
      '<i title="3\'5"></i>',
      'should not encode characters which cause XSS issues in older browsers, in `allowDangerousCharacters` mode'
    )

    st.end()
  })

  t.end()
})

function toString() {
  return 'yup'
}
