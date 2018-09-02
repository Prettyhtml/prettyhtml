'use strict'

var test = require('ava')
var vfile = require('to-vfile')
var parse5 = require('@starptech/prettyhtml-parse')
var fromParse5 = require('..')

test('hast-util-from-parse5', function(t) {
  var file = vfile({ contents: '<title>Hello!</title><h1>World!' })

  t.deepEqual(
    fromParse5(parse5.parse(String(file))),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'html',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'head',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'title',
                  properties: {},
                  children: [{ type: 'text', value: 'Hello!' }]
                }
              ]
            },
            {
              type: 'element',
              tagName: 'body',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'h1',
                  properties: {},
                  children: [{ type: 'text', value: 'World!' }]
                }
              ]
            }
          ]
        }
      ],
      data: { quirksMode: true }
    },
    'should transform a complete document'
  )

  t.deepEqual(
    fromParse5(parse5.parseFragment(String(file))),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'title',
          properties: {},
          children: [{ type: 'text', value: 'Hello!' }]
        },
        {
          type: 'element',
          tagName: 'h1',
          properties: {},
          children: [{ type: 'text', value: 'World!' }]
        }
      ],
      data: { quirksMode: false }
    },
    'should transform a fragment'
  )

  t.deepEqual(
    fromParse5(
      parse5.parse(String(file), { sourceCodeLocationInfo: true }),
      file
    ),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'html',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'head',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'title',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'Hello!',
                      position: {
                        start: { line: 1, column: 8, offset: 7 },
                        end: { line: 1, column: 14, offset: 13 }
                      }
                    }
                  ],
                  position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 1, column: 22, offset: 21 }
                  }
                }
              ]
            },
            {
              type: 'element',
              tagName: 'body',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'h1',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'World!',
                      position: {
                        start: { line: 1, column: 26, offset: 25 },
                        end: { line: 1, column: 32, offset: 31 }
                      }
                    }
                  ],
                  position: {
                    start: { line: 1, column: 22, offset: 21 },
                    end: { line: 1, column: 32, offset: 31 }
                  }
                }
              ]
            }
          ]
        }
      ],
      data: { quirksMode: true },
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 32, offset: 31 }
      }
    },
    'should accept a file as options'
  )

  t.deepEqual(
    fromParse5(parse5.parse(String(file)), file),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'html',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'head',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'title',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'Hello!'
                    }
                  ]
                }
              ]
            },
            {
              type: 'element',
              tagName: 'body',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'h1',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'World!'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      data: { quirksMode: true }
    },
    'should accept a file as options (without location info)'
  )

  t.deepEqual(
    fromParse5(
      {
        nodeName: 'title',
        tagName: 'title',
        attrs: [],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [
          {
            nodeName: '#text',
            value: 'Hello!',
            sourceCodeLocation: {}
          }
        ],
        sourceCodeLocation: {
          startLine: 1,
          startCol: 1,
          startOffset: 0
        }
      },
      file
    ),
    {
      type: 'element',
      tagName: 'title',
      properties: {},
      children: [
        {
          type: 'text',
          value: 'Hello!'
        }
      ],
      position: { start: { line: 1, column: 1, offset: 0 }, end: null }
    },
    'should support synthetic locations'
  )

  t.deepEqual(
    fromParse5(
      {
        nodeName: 'p',
        tagName: 'p',
        attrs: [],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [
          {
            nodeName: '#text',
            value: 'Hello!',
            sourceCodeLocation: {
              startLine: 1,
              startCol: 4,
              startOffset: 3,
              endLine: 1,
              endCol: 10,
              endOffset: 9
            }
          }
        ],
        sourceCodeLocation: {
          startLine: 1,
          startCol: 1,
          startOffset: 0
        }
      },
      file
    ),
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        {
          type: 'text',
          value: 'Hello!',
          position: {
            start: { line: 1, column: 4, offset: 3 },
            end: { line: 1, column: 10, offset: 9 }
          }
        }
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 10, offset: 9 }
      }
    },
    'should support synthetic locations on unclosed elements'
  )

  t.deepEqual(
    fromParse5(
      parse5.parseFragment(
        [
          '<svg width="230" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
          '<circle cx="60"  cy="60" r="50" fill="red"/>',
          '</svg>'
        ].join('\n')
      ),
      { space: 'svg' }
    ),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'svg',
          properties: {
            width: '230',
            height: '120',
            viewBox: '0 0 200 200',
            xmlns: 'http://www.w3.org/2000/svg',
            xmlnsXLink: 'http://www.w3.org/1999/xlink'
          },
          children: [
            { type: 'text', value: '\n' },
            {
              type: 'element',
              tagName: 'circle',
              properties: { cx: '60', cy: '60', r: '50', fill: 'red' },
              children: [],
              data: {
                selfClosing: true
              }
            },
            { type: 'text', value: '\n' }
          ]
        }
      ],
      data: { quirksMode: false }
    },
    'should transform svg'
  )
})
