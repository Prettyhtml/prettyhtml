# @starptech/expression-parser

Framework agnostic expression parser

## Installation

```
npm install --save @starptech/expression-parser
```

## Usage

This example shows how we parse HTML

```js
const parse = require('@starptech/expression-parser')
const result = parse(`{ a + /<g></g> b }`, { brackets: ['{', '}'] })
```

## Representation

- `unescape`: Indentify a template marker as escaped. This information is useful to understand why a marker was skipped
- `expressions`: A list of template expressions
  - `start`: Start position
  - `end`: End position
  - `text`: The content of the expression

```json
{
  "unescape": "",
  "expressions": [
    {
      "start": 1,
      "end": 19,
      "text": " a + /<g></g> b "
    }
  ]
}
```

## Credits

The parser is a modificated version of [Riot](https://github.com/riot/parser) template expression parser.
