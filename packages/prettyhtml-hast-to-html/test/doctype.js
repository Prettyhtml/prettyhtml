'use strict'

var test = require('ava')
var u = require('unist-builder')
var to = require('..')

test('`doctype`', function(t) {
  t.deepEqual(to(u('doctype')), '<!doctype>', 'should stringify doctypes without `name`')

  t.deepEqual(to(u('doctype', { name: 'html' })), '<!doctype html>', 'should stringify doctypes with `name`')

  t.deepEqual(
    to(u('doctype', { name: 'html' }), { tightDoctype: true }),
    '<!doctypehtml>',
    'should stringify doctypes with `name` tightly in `tightDoctype` mode'
  )

  t.deepEqual(
    to(
      u('doctype', {
        name: 'html',
        public: '-//W3C//DTD XHTML 1.0 Transitional//EN'
      })
    ),
    '<!doctype html public "-//W3C//DTD XHTML 1.0 Transitional//EN">',
    'should stringify doctypes with a public identifier'
  )

  t.deepEqual(
    to(
      u('doctype', {
        name: 'html',
        public: '-//W3C//DTD XHTML 1.0 Transitional//EN'
      }),
      { tightDoctype: true }
    ),
    '<!doctypehtml public"-//W3C//DTD XHTML 1.0 Transitional//EN">',
    'should stringify doctypes with a public identifier tightly in `tightDoctype` mode'
  )

  t.deepEqual(
    to(u('doctype', { name: 'html', system: 'about:legacy-compat' })),
    '<!doctype html system "about:legacy-compat">',
    'should stringify doctypes with a system identifier'
  )

  t.deepEqual(
    to(u('doctype', { name: 'html', system: 'about:legacy-compat' }), {
      tightDoctype: true
    }),
    '<!doctypehtml system"about:legacy-compat">',
    'should stringify doctypes with a system identifier tightly in `tightDoctype` mode'
  )

  t.deepEqual(
    to(
      u('doctype', {
        name: 'html',
        public: '-//W3C//DTD HTML 4.01//',
        system: 'http://www.w3.org/TR/html4/strict.dtd'
      })
    ),
    '<!doctype html public "-//W3C//DTD HTML 4.01//" "http://www.w3.org/TR/html4/strict.dtd">',
    'should stringify doctypes with both identifiers'
  )

  t.deepEqual(
    to(
      u('doctype', {
        name: 'html',
        public: '-//W3C//DTD HTML 4.01//',
        system: 'http://www.w3.org/TR/html4/strict.dtd'
      }),
      { tightDoctype: true }
    ),
    '<!doctypehtml public"-//W3C//DTD HTML 4.01//""http://www.w3.org/TR/html4/strict.dtd">',
    'should stringify doctypes with both identifiers tightly in `tightDoctype` mode'
  )

  t.deepEqual(
    to(
      u('doctype', {
        name: 'html',
        system: 'taco"'
      })
    ),
    "<!doctype html system 'taco\"'>",
    'should quote smartly'
  )
})
