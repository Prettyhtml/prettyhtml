![Prettyhtml Banner](/logo.png)

<h2 align="center">Opinionated Web Component HTML formatter</h2>

<p align="center">
  <a href="https://www.npmjs.com/package/prettyhtml">
    <img alt="npm version" src="https://img.shields.io/npm/v/prettyhtml.svg?style=flat-square">
  </a>
</p>

- Remove superfluous white-space but still line-wrap as expected.
- Reorder attributes based on how often they occur.
- Special indentation for [`custom elements`](https://developers.google.com/web/fundamentals/web-components/).
- No content manipulation in attributes or tags.

## Install

```
$ npm install prettyhtml --global
```

## Command Line

```
$ prettyhtml example.md ./**/*.html
```

## Help

```
$ prettyhtml --help
```

## API

```js
const prettyhtml = require('prettyhtml')
const result = prettyhtml(`<element></element>`)
```

## Why

Prettier has no support for HTML.


## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
