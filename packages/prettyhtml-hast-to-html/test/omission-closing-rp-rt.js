'use strict'

var test = require('ava')
var h = require('@starptech/prettyhtml-hastscript')
var to = require('..')

'rp,rt'.split(',').forEach(function(tagName, index, values) {
  test('`' + tagName + '` (closing)', function(t) {
    var other = values[index ? 0 : 1]

    t.deepEqual(
      to(h(tagName), { omitOptionalTags: true }),
      '<' + tagName + '>',
      'should omit tag without parent'
    )

    t.deepEqual(
      to(h('ruby', h(tagName)), { omitOptionalTags: true }),
      '<ruby><' + tagName + '></ruby>',
      'should omit tag without following'
    )

    t.deepEqual(
      to(h('ruby', [h(tagName), h(tagName)]), { omitOptionalTags: true }),
      '<ruby><' + tagName + '><' + tagName + '></ruby>',
      'should omit tag followed by `' + tagName + '`'
    )

    t.deepEqual(
      to(h('ruby', [h(tagName), h(other)]), { omitOptionalTags: true }),
      '<ruby><' + tagName + '><' + other + '></ruby>',
      'should omit tag followed by `' + other + '`'
    )

    t.deepEqual(
      to(h('ruby', [h(tagName), h('p')]), { omitOptionalTags: true }),
      '<ruby><' + tagName + '></' + tagName + '><p></ruby>',
      'should not omit tag followed by others'
    )
  })
})
