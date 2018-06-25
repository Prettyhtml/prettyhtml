![Prettyhtml Banner](/logo.png)

<h2 align="center">Opinionated Web Component HTML formatter</h2>

<p align="center">
  <a href="https://www.npmjs.com/package/prettyhtml">
    <img alt="npm version" src="https://img.shields.io/npm/v/@starptech/prettyhtml.svg?style=flat-square">
  </a>
</p>

- Remove superfluous white-space but still line-wrap as expected.
- Special indentation for [`custom elements`](https://developers.google.com/web/fundamentals/web-components/).
- Reorder attributes based on how often they occur.
- Support case-sensitive html tags and attributes.
- Sort attribute values.
- No content sanitization.

## Example

In

```html
<!-- custom --><custom [ngModel]="currentHero.name" class="b c a"
  (ngModelChange)="setUppercaseName($event)">
    <custom2 [ngModel]="currentHero.name"     (ngModelChange)="setUppercaseName($event)">   </custom2>
</custom>
<p>Some <code>  code  </code>, <em> emphasis </em>, and <br> <strong> importance </strong>
  .</p>
```

Out

```html
<!-- custom -->
<custom
  [ngModel]="currentHero.name"
  (ngModelChange)="setUppercaseName($event)"
  class="a b c">
  <custom2
    [ngModel]="currentHero.name"
    (ngModelChange)="setUppercaseName($event)">
  </custom2>
</custom>
<p>
  Some <code>code</code>, <em>emphasis</em>, and<br><strong>importance</strong>
  .
</p>
```

## Packages

* [prettyhtml](/packages/prettyhtml) CLI and API.
* [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
* [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
* [prettyhtml-parse](/packages/prettyhtml-parse) HTML parser and serializer.
* [prettyhtml-rehype-parse](/packages/prettyhtml-rehype-parse) Adapter between HTML parser and rehype.
* [prettyhtml-hast-util-from-parse](/packages/prettyhtml-hast-util-from-parse) Transform prettyhtml-parse AST to HAST.
* [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.

## Install

```
$ npm install @starptech/prettyhtml --global
```

## Command Line

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
const result = prettyhtml(`<custom foo="bar"></custom>`, { tabWidth: 2 })
```
 
## Why

Prettier has no support for HTML.


## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
