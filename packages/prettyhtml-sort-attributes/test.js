'use strict'

const test = require('ava')
const rehype = require('rehype')
const h = require('@starptech/prettyhtml-hastscript')
const min = require('.')

test('rehype-sort-attributes', function(t) {
  t.deepEqual(
    rehype().stringify(
      rehype()
        .use(min)
        .runSync(
          h(
            'p',
            {
              z: 'foo',
              d: ['bar'],
              c: 'foo',
              b: 1,
              a: 'foo',
              2: 2,
              1: 1,
              '[foo]': 'foo'
            },
            [h('strong', { id: 'baz', className: ['qux'] }), h('em', { hidden: false, className: ['quux'] })]
          )
        )
    ),
    rehype().stringify(
      h(
        'p',
        {
          1: 1,
          2: 2,
          '[foo]': 'foo',
          a: 'foo',
          b: 1,
          c: 'foo',
          d: ['bar'],
          z: 'foo'
        },
        [h('strong', { className: ['qux'], id: 'baz' }), h('em', { hidden: false, className: ['quux'] })]
      )
    )
  )
})
