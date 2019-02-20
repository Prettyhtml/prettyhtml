/* eslint-disable no-template-curly-in-string */

module.exports = {
  'must preserve inner spaces': {
    data: '{ 0 }'
  },

  'must preserve inner spaces #2': {
    data: '{\n\t0\n}'
  },

  'must preserve inner spaces #3': {
    data: '{\n0\n+\n1 }'
  },

  'expression containing javascript keywords': {
    data: '{ if (foo) { bar } else { baz } }'
  },

  'must handle double quotes inside unquoted expression': {
    data: 'foo {"<a>"}'
  },

  'must handle double quotes inside double quoted expression': {
    data: 'foo "{"<a>"}"'
  },

  'must handle single quotes inside single quoted expression': {
    data: "foo '{'<a>'}'"
  },

  'simple expression': {
    data: 'foo & { 0 }'
  },

  'expression with embeded brackets': {
    data: 'foo & { "{" }'
  },

  'ternary with embeded brackets': {
    data: "foo & { s === \"{\" ? '' : '}' }"
  },

  'literal regex in expression': {
    data: '{ s: /}/ }'
  },

  'like-regex sequence in expression': {
    data: '{ a++ /5}{0/ -1 }'
  },

  'tricky regex': {
    data: '{ a-++/}/i.lastIndex }'
  },

  'tricky regex / 2': {
    data: '{ .../5./2/ }'
  },

  'regex with tags inside': {
    data: ' { a + /<g></g> b } '
  },

  shortcut: {
    data: '{ a: 1, "b": fn(a,b) }'
  },

  'attributes: simple expression': {
    data: '{e}'
  },

  'Shortcuts in attributes': {
    data: '{ s: "}", c: \'{\', d: /}/ }'
  },

  'single quoted expr': {
    data: "{'e'}"
  },

  'double quoted expr': {
    data: '{"e"}'
  },

  'multiline string (using "\\") inside attribute value': {
    data: '{\n"<div>\\\n\t<a></a>\\\n</div>"\n}'
  },

  'multiline string (using "\\") inside text node': {
    data: '{\n"<div>\\\n\t<a></a>\\\n</div>"\n}'
  },

  'escaped left bracket generates a `unescape` property w/char to unescape': {
    data: '\\{{e}'
  },

  'escaped left bracket generates a `unescape` property w/char to unescape #2': {
    data: '\\{\\{}'
  },

  'escaped left bracket generates a `unescape` property w/char to unescape #3': {
    data: '\\{\\{}'
  },

  // =========================================================================
  // ES6
  // =========================================================================

  'ES6 expression inside tag': {
    data: 'foo & { `bar${baz}` }'
  },

  'ES6 with ES6 backquote inside': {
    data: 'foo & { `bar${`}`}` }'
  },

  'ES6 with ternary inside': {
    data: 'foo & { `bar${ a?"<a>":\'}\' }` }'
  },

  'Expression inside tag with multiline ES6': {
    data: 'foo & { `\nbar${\n\t`}`}\n` }'
  },

  'Expression inside tag with multiline ES6 #2': {
    data: 'foo & {\n`\nbar\n${\t`}`}`\n }'
  },

  'ES6 with ES6 backquote inside #2': {
    data: 'foo & { `bar${``}` }'
  },

  'ES6 with double quotes inside': {
    data: 'foo & "{ `bar${ "a" + `b${""}` }` }"'
  },

  'ES6 with double quotes inside #2': {
    data: 'foo & "{ `"bar${ "a" + `b${""}` }"` }"'
  },

  'ES6 with ES6 backquote and closing bracket inside': {
    data: 'foo & { `bar${ "a" + `b${a + "}"}` }` }'
  },

  // =========================================================================
  // Custom brackets
  // =========================================================================

  'Custom brackets `[ ]`': {
    options: { brackets: ['[', ']'] },
    data: '[1+2]'
  },

  'Custom brackets `[ ]` w/nested brackets': {
    options: { brackets: ['[', ']'] },
    data: '[a[1]]'
  },

  'Custom brackets `[[ ]]` w/nested brackets': {
    options: { brackets: ['[[', ']]'] },
    data: '[[a[1]]]'
  },

  'Custom brackets `[ ]` w/preceding escaped bracket': {
    options: { brackets: ['[', ']'] },
    data: '\\[[1+2]'
  },

  'Custom brackets `( )` w/nested brackets': {
    options: { brackets: ['(', ')'] },
    data: '(a(1))'
  },

  'Custom brackets `( )` preceding by escaped bracket': {
    options: { brackets: ['(', ')'] },
    data: '\\((1+2)'
  },

  'Custom brackets `([ ])` w/nested brackets': {
    options: { brackets: ['([', '])'] },
    data: '([a([1])])'
  },

  'Custom brackets `{{ }` w/nested brackets': {
    options: { brackets: ['{{', '}'] },
    data: '{{{}}'
  },

  'Custom brackets `{ }}` w/nested brackets': {
    options: { brackets: ['{', '}}'] },
    data: '{{}}}'
  },

  'Custom brackets `${ }` w/ES6 inside': {
    options: { brackets: ['${', '}'] },
    data: '${`a${0}`}'
  },

  'Custom brackets `% %` w/ES6': {
    options: { brackets: ['%', '%'] },
    data: '% `a${0}` %'
  },

  'Custom brackets `${ }` preceding by escaped bracket': {
    options: { brackets: ['${', '}'] },
    data: '\\${${{}}}"'
  },

  // Angular

  'Angular simple': {
    options: { brackets: ['{{', '}}'] },
    data: '{{title}}'
  },
  'Angular pipe': {
    options: { brackets: ['{{', '}}'] },
    data: '{{title | uppercase}}'
  },
  'Angular safe-navigator operator': {
    options: { brackets: ['{{', '}}'] },
    data: '{{currentHero?.name}}'
  },

  // Vue

  'Vue simple': {
    options: { brackets: ['{{', '}}'] },
    data: '{{title}}'
  },
  'Vue complex': {
    options: { brackets: ['{{', '}}'] },
    data: "{{ message.split('').reverse().join('') }}"
  },

  // Svelte

  'Svelte tags': {
    options: { brackets: ['{', '}'] },
    data: '{@debug name}'
  },
  'Svelte await-then-catch': {
    options: { brackets: ['{', '}'] },
    data: '{#await promise}{:then answer}{:catch error}{\\/await}'
  },
  'Svelte blocks with expressions': {
    options: { brackets: ['{', '}'] },
    data: '{#await promise}{message}{:then answer}{messageThen}{:catch error}{messageError}{\\/await}'
  },
  'Svelte nested blocks': {
    options: { brackets: ['{', '}'] },
    data: '{#await promise}{#if test}{\\/if}{:then answer}{:catch error}{\\/await}'
  },
  'Svelte each': {
    options: { brackets: ['{', '}'] },
    data: '{#each rows as row, y}{\\/each}'
  }
}
