![Prettyhtml Banner](/logo.png)

<h2 align="center">Opinionated Web Component HTML formatter</h2>

- Remove unneeded white-space
- Reorder attributes
- Format custom elements specifically

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
