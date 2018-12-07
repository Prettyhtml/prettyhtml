const test = require('ava')
const prettyhtml = require('../')

test.cb('single quotes', t => {
  const output = prettyhtml('<div id="foo" class=bar/>\n', {
    singleQuote: true
  })
  t.is(
    output.contents,
    "<div id='foo' class='bar'/>\n",
    'should use single instead of double quotes'
  )
  t.end()
})

test.cb('sort attributes', t => {
  const output = prettyhtml('<div b="bar" a="foo"/>\n', {
    sortAttributes: true
  })
  t.is(
    output.contents,
    '<div a="foo" b="bar"/>\n',
    'attributes should be sorted alphabetically'
  )
  t.end()
})
