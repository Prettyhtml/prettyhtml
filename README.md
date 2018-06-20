# Prettyhtml

Prettyhtml is an opinionated HTML code formatter.

- White-space optimization based on [rehype-format](https://github.com/rehypejs/rehype-format).
- Reorder attributes based on how often they occur [rehype-sort-attributes](https://github.com/rehypejs/rehype-minify/tree/master/packages/rehype-sort-attributes)
- Minify white-space in attributes [rehype-minify-attribute-whitespace](https://github.com/rehypejs/rehype-minify/tree/master/packages/rehype-minify-attribute-whitespace)

## Custom elements

We make differences between custom elements. This is implemented by a fork of [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html).

Following rules are applied:

- Atributes are indented with 2 spaces
- Content is whitespace insensitive
- Closing tag appear on a new line

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
      aria-label="{{item.label}}">{{ item.label }}
    </my-sub-sub-component>
  </my-sub-component>
</my-component>
```

## Acknowledgement

The whole [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
