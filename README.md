# Prettyhtml

Prettyhtml is an opinionated HTML code formatter.

Format white-space in the processed tree.

- Collapse all white-space (to a single space or newline)
- Remove unneeded white-space
- Inject needed newlines and indentation
- Indent previously collapsed newlines properly
- All superfluous white-space is removed. However, as newlines are kept (and later properly indented), your code will still line-wrap as expected.
- Reorder attributes based on how often they occur. [rehype-sort-attributes](https://github.com/rehypejs/rehype-minify/tree/master/packages/rehype-sort-attributes)
- Minify white-space in attributes [rehype-minify-attribute-whitespace](https://github.com/rehypejs/rehype-minify/tree/master/packages/rehype-minify-attribute-whitespace)

## Custom elements

- Atributes are indented with 2 spaces
- Content is whitespace insensitive
- Closing tag does not appear on a new line

### In

```html
<my-component ng-model="selected"><my-sub-component ng-repeat="item in items" ng-value="item.value" aria-label="{{item.label}}">
{{ item.label }}<div>foo<div>baz</div></div><section>bar</section>
<my-sub-sub-component ng-repeat="item in items" ng-value="item.value" aria-label="{{item.label}}">{{ item.label }}</my-sub-sub-component></my-sub-component></my-component>
```

### Out

```html
<my-component
  ng-model="selected">
  <my-sub-component
    ng-repeat="item in items"
    ng-value="item.value"
    aria-label="{{item.label}}">{{ item.label }}
    <div>foo
      <div>baz</div>
    </div>
    <section>bar</section>
    <my-sub-sub-component
      ng-repeat="item in items"
      ng-value="item.value"
      aria-label="{{item.label}}">{{ item.label }}</my-sub-sub-component>
  </my-sub-component>
</my-component>
```

## Acknowledgement

The whole [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
