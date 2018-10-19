![Prettyhtml Banner](/logo.png)

[![Build Status](https://dev.azure.com/starptech/Prettyhtml/_apis/build/status/Prettyhtml.prettyhtml)](https://dev.azure.com/starptech/Prettyhtml/_build/latest?definitionId=1)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![npm version](https://badge.fury.io/js/%40starptech%2Fprettyhtml.svg)](https://badge.fury.io/js/%40starptech%2Fprettyhtml)

Opinionated general formatter for your Angular, Vue, Svelte or pure HTML5 templates. Try it on the [playground](https://prettyhtml.netlify.com/).

## Features

* Can parse Angular, Vue or HTML5 templates (even self-closing custom elements).
* Formats embedded content with [prettier](https://github.com/prettier/prettier) with respect to your local settings.
* Doesn't change the behaviour of your attributes and tags.
* Remove all superfluous white-space.
* Enforce consistent output of your HTML.

## Packages

- [prettyhtml](/packages/prettyhtml) CLI and API.
- [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
- [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
- [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.
- [prettyhtml-quick](/packages/prettyhtml-quick) Formats your changed files based on Git.
- [webparser](/packages/webparser) Optimized HTML parser for formatters
- [rehype-webparser](/packages/rehype-webparser) Adapter between HTML parser and rehype.
- [rehype-minify-whitespace](/packages/rehype-minify-whitespace) Collapse whitespace.
- [hast-util-from-parse](/packages/hast-util-from-webparser) Transform [webparser](/packages/webparser) AST to HAST.

## Example
Test it on [repl.it](https://repl.it/@StarpTech/PrettyHtml)

## Ignore specific elements

Adding this flag before a tag will preserve whitespaces and skip attribute wrapping.
```html
<!-- prettyhtml-ignore -->
<div></div>
```

## Install

```bash
# regular
$ npm install @starptech/prettyhtml --global

# when using proxy like sinopia/verdaccio
$ npm install @starptech/prettyhtml --global --registry=https://registry.npmjs.org/
```

## CLI

```
$ prettyhtml example.html "./**/*.html"
```

## Help

```
$ prettyhtml --help
```

## API

```js
const prettyhtml = require('@starptech/prettyhtml')
try {
  const vFile = prettyhtml(`<custom foo="bar"></custom>`, {
    tabWidth: 2,        // the space width of your indentation level (default: 2)
    useTabs: false,     // use tabs instead spaces for indentation (default: false)
    printWidth: 80,     // use different maximum line length (default: 80)
    usePrettier: true,  // use prettier for embedded content (default: true)
    singleQuote: false  // use single quote instead double quotes (default: `"`)
                        // only needed if you use single quotes in your templates
    prettier: {}        // use custom prettier settings for embedded content
  })
  console.log(vFile.contents)
} catch(error) {
  console.error(error)
}
```

##### `prettyhtml(doc: string, options?): vFile`

Formats a string and returns a [`vFile`](https://github.com/vfile/vfile). The method can throw e.g when a parsing error was produced. The error is from type [`vfile-message`](https://github.com/vfile/vfile-message).

## Editor support

* [VSCode](https://github.com/StarpTech/prettyhtml-vscode) extension (not published yet)

## Why

While prettier has basic HTML support soon it's far from useful ([Issue 5098](https://github.com/prettier/prettier/issues/5098)) and there are too many opinions. Therefore I don't like how the formatter is implemented because they don't split the formatter in testable pieces like plugins or modules which make it very hard to get into it. Due to the awesome groundwork by [@rehype](https://github.com/rehypejs), [@unifiedjs](https://github.com/unifiedjs) (and @vfile, @syntax-tree) we can rely on a specification and use all plugins of the ecosystem. I love prettier for everything else but in the meantime I need a general formatter in order to talk less about formatting. Prettyhtml should be able to format any superset of HTML as long it is parseable with minor tweaks. We use a modified version of the Angular 6 template parser.

## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
