# @starptech/rehype-minify-whitespace

Collapse whitespace.

Normally, collapses to a single space.  If `newlines: true`,
collapses white-space containing newlines to `'\n'` instead
of `' '`.

## Installation

```
npm install --save @starptech/rehype-minify-whitespace
```

## Usage

##### In

```html
<h1>Heading</h1>
<p><strong>This</strong> and <em>that</em></p>
```

##### Out

```html
<h1>Heading</h1><p><strong>This</strong> and <em>that</em></p>
```

## Api

###### `node.data.ignore`

When the data-property `ignore` is `true` the node is skipped for collapsing.
