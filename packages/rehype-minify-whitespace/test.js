'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('ava')
var rehype = require('rehype')
var h = require('hastscript')
var min = require('.')

test('rehype-minify-whitespace', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('main', [
          '  ',
          h('p', [
            '  ',
            h('strong', 'foo'),
            '  ',
            h('em', 'bar'),
            '  ',
            h('meta', { itemProp: true }),
            '  '
          ]),
          '  ',
          h('p', [
            h('a', { href: 'example.com' }, ' baz'),
            '  ',
            h('em', ' qux')
          ]),
          '  '
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo'),
        ' ',
        h('em', 'bar'),
        ' ',
        h('meta', { itemProp: true })
      ]),
      h('p', [h('a', { href: 'example.com' }, 'baz'), ' ', h('em', 'qux')])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('head', [
          '  ',
          h('meta', { itemProp: true }),
          '  ',
          h('noscript', [
            '  ',
            h('link', { rel: ['stylesheet'], href: 'index.css' }),
            '  '
          ])
        ])
      ),
    h('head', [
      h('meta', { itemProp: true }),
      h('noscript', [h('link', { rel: ['stylesheet'], href: 'index.css' })])
    ])
  )

  t.deepEqual(
    rehype()
      .use(min, { newlines: true })
      .runSync(
        h('main', [
          '  ',
          h('p', [
            '\n ',
            h('strong', 'foo'),
            '  ',
            h('em', 'bar'),
            ' \n \n',
            h('meta', { itemProp: true }),
            ' \n'
          ]),
          ' \n\n',
          h('p', [
            h('a', { href: 'example.com' }, ' baz'),
            '  ',
            h('em', ' qux')
          ]),
          '  '
        ])
      ),
    h('main', [
      h('p', [
        h('strong', 'foo'),
        ' ',
        h('em', 'bar'),
        '\n\n',
        h('meta', { itemProp: true })
      ]),
      h('p', [h('a', { href: 'example.com' }, 'baz'), ' ', h('em', 'qux')])
    ])
  )
})
