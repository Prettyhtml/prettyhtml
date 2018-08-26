![Prettyhtml Banner](/logo.png)

Opinionated general formatter for your Angular, Vue or pure HTML5 templates. Try it on [repl.it](https://repl.it/@StarpTech/PrettyHtml).

## Features

* Can parse Angular, Vue or HTML5 templates (even self-closing custom elements).
* Formats embedded content with [prettier](https://github.com/prettier/prettier) with respect to your local settings.
* Remove all superfluous white-space.
* Enforce consistent output of your HTML.

## Packages

- [prettyhtml](/packages/prettyhtml) CLI and API.
- [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
- [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
- [prettyhtml-parse](https://github.com/StarpTech/parse5) HTML parser and serializer (fork of [parse5](https://github.com/inikulin/parse5))
- [prettyhtml-rehype-parse](/packages/prettyhtml-rehype-parse) Adapter between HTML parser and rehype.
- [prettyhtml-hast-util-from-parse](/packages/prettyhtml-hast-util-from-parse) Transform prettyhtml-parse AST to HAST.
- [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.

## Example
Test it on [repl.it](https://repl.it/@StarpTech/PrettyHtml)

## Ignore specific elements

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
$ prettyhtml example.html ./**/*.html
```

## Help

```
$ prettyhtml --help
```

## API

```js
const prettyhtml = require('@starptech/prettyhtml')
const result = prettyhtml(`<custom foo="bar"></custom>`, {
  tabWidth: 2,        // the space width of your indentation level (default: 2)
  useTabs: false,     // use tabs instead spaces for indentation (default: false)
  printWidth: 80,     // use different maximum line length (default: 80)
  usePrettier: true,  // use prettier for embedded content (default: true)
  singleQuote: false  // use single quote instead double quotes (default: `"`)
                      // only needed if you use single quotes in your templates
})
```

## Why

Prettier has no support for template syntaxes like Angular or Vue. There is an open [PR](https://github.com/prettier/prettier/pull/4753) but there is no agreement on it. In the meantime I need a general formatter in order to talk less about formatting. Prettyhtml should be able to format any superset of HTML as long it is parseable with minor tweaks. We maintain a [fork](https://github.com/StarpTech/parse5) of the most robust HTML5 parser. Some other packages from the [rehype](https://github.com/rehypejs/rehype) ecosystem were modified to our needs.

## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
