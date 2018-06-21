# Prettyhtml

Prettyhtml is an opinionated HTML code formatter. It should help to enforce a consistent style.

> I don't want to talk about formatting in my frontend components ;)

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
prettyhtml(`<element></element>`)
```

## Why

Prettier has no support for HTML.


## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
