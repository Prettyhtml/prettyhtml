<div align="center">
<h1>@starptech/webparser</h1>
<p>Optimized html parser for HTMl5 Web Components.</p>
</div>
<br>

<div align="center">
<code>npm install --save @starptech/webparser</code>
</div>

### Features

- Can parse custom self-closing elements
- Can parse tags and attributes case-sensitive
- Can skip decoding of html entities
- Can consume the first linefeed in `pre`, `textarea` or `listing` tags (is skipped by HTML5 spcs)

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
