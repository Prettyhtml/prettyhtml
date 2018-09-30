# @starptech/webparser

Optimized html parser for HTML5 Web Components.

## Features

- Can parse custom self-closing elements
- Can parse tags and attributes case-sensitive
- Can skip decoding of html entities
- Can consume the first linefeed in `pre`, `textarea` or `listing` tags (is skipped by HTML5 spec)

_Those features are very useful if you want to implement a HTML formatter or anything else where a less strict parser is needed to keep all informations in the ast._

## Installation

```
npm install --save @starptech/webparser
```

## Usage

This example shows how we parse HTML

```js
const parser = new HtmlParser(options)
const result = parser.parse('<div></div>')
result.errors
result.rootNodes
```

## API

###### `options.decodeEntities`

Decode html entities in text and attributes

###### `options.ignoreFirstLf`

Ignore first line feed of `pre`, `textarea` and `listing` tags

###### `options.selfClosingCustomElements`

Allow custom self-closing elements. A custom element is an HTML tag which isn't part of the official HTML5 specification.

## Credits

The parser is a modificated version of [Angular 6](https://github.com/angular/angular) template parser.
