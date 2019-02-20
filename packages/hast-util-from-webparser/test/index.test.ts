import { HtmlParser } from '@starptech/webparser'
import fromWebParser from '../index'

function getParserOpt() {
  return {
    ignoreFirstLf: false,
    decodeEntities: false,
    selfClosingCustomElements: true,
    selfClosingElements: true
  }
}

test('Attributes', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<p id="foo" class="bar baz" data-qux="quux"></p>
  <p data-123="456"></p>
  <img alt hidden>
  <a download></a>
  <a download=example.mp3></a>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Element void', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `
  <img>
  <hr>
  <br>
  <meta>
  <area>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Simple', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<div><p>foo</p></div>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('SVG', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<div>
  <svg width="230" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <circle cx="60"  cy="60" r="50" fill="red"/>
    <circle cx="170" cy="60" r="50" fill="green"/>
  </svg>
</div>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('SVG - should preserve explicit svg namespace', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<div>
  <svg:svg width="230" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <svg:circle cx="60"  cy="60" r="50" fill="red"/>
    <svg:circle cx="170" cy="60" r="50" fill="green"/>
  </svg:svg>
</div>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Template', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<template id="text">!</template>
    <TEMPLATE id="html"><strong>importance</strong> and <em>emphasis</em>.</TEMPLATE>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Comment', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<!-- foo -->`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Attributes with colon or @ as prefix', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<div :type="" @foo="bar"></div>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Attributes with colon, binding syntax and namespace', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<div id="app"><prism-editor :xlink:href="'myHref'" :foo="dddd" xmlns:xlink="http://www.w3.org/1999/xlink" /></div>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Case sensitive attributes', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<div ASYNC></div>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Doctype', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<!DOCTYPE html>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Doctype nameless', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<!DOCTYPE>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Doctype with html skeleton', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<!DOCTYPE><html><head></head><body>foo</body></html>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Attributes with namespace', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(`<svg xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`, 'TestComp')

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})

test('Gaps detection - should set gapAfter data on elements followed by empty lines', () => {
  const parser = new HtmlParser(getParserOpt())
  const result = parser.parse(
    `<div></div>


    <img>

    <p>
      Hello

      <em>There</em>
    </p>
    <div></div>`,
    'TestComp'
  )

  expect(result.errors.length).toBe(0)

  const node = fromWebParser(result.rootNodes, {})

  expect(node).toMatchSnapshot()
})
