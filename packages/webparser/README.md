# @starptech/webparser

Optimized html parser for HTML5 Web Components.

```
npm install --save @starptech/webparser
```

### Features

- Can parse custom self-closing elements
- Can parse tags and attributes case-sensitive
- Can skip decoding of html entities
- Can consume the first linefeed in `pre`, `textarea` or `listing` tags (is skipped by HTML5 spec)

_Those features are very useful if you want to implement a HTML formatter or anything else where a less strict parser is needed to keep all informations in the ast._

## Example

```js
const parser = new HtmlParser({
  decodeEntities: true,
  ignoreFirstLf: true,
  selfClosingCustomElements: true
})

const result = parser.parse('<div></div>')
result.errors
result.rootNodes
```

## Credits

The parser is a moificated version of [Angular 6](https://github.com/angular/angular) template parser.
