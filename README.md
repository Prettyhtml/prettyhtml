![Prettyhtml Banner](/logo.png)

* Parse Angular, Vue or HTML5 templates.
* Formats embedded content with [prettier](https://github.com/prettier/prettier).
* Remove all superfluous white-space. 
* Enforce consistent output of your HTML.

## Example

In

```html
<!-- custom -->
<my-component ng-model="selected"><custom FOO="test" class="test" title="title"></custom>
<form #heroForm (ngSubmit)="onSubmit(heroForm)" title="title" data-foo="foo" data-baz="baz"> <input
type="text" [(onChange)]="dede" name="test"> <button [style.color]="isSpecial ? 'red' : 'green'"></button>
<div>Foo bar test</div>
</form>
</my-component>
```

Out

```html
<!-- custom -->
<my-component ng-model="selected">
  <custom FOO="test" class="test" title="title"></custom>
  <form #heroForm (ngSubmit)="onSubmit(heroForm)" title="title" data-foo="foo" data-baz="baz">
    <input
      type="text"
      [(onChange)]="dede"
      name="test">
    <button [style.color]="isSpecial ? 'red' : 'green'"></button>
    <div>Foo bar test</div>
  </form>
</my-component>
```

## Packages

- [prettyhtml](/packages/prettyhtml) CLI and API.
- [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
- [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
- [prettyhtml-parse](/packages/prettyhtml-parse) HTML parser and serializer.
- [prettyhtml-rehype-parse](/packages/prettyhtml-rehype-parse) Adapter between HTML parser and rehype.
- [prettyhtml-hast-util-from-parse](/packages/prettyhtml-hast-util-from-parse) Transform prettyhtml-parse AST to HAST.
- [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.

## Install

```
$ npm install @starptech/prettyhtml --global
```

## Command Line

```
$ prettyhtml example.html ./**/*.html
```

## Help

```
$ prettyhtml --help
```

## API

```js
const prettyhtml = require('@starptech/prettyhtml')
const result = prettyhtml(`<custom foo="bar"></custom>`, {
  tabWidth: 2,
  useTabs: false
})
```

## Ignore specific elments

```html
<!-- prettyhtml-ignore -->
<div></div>
```

## Why

Prettier has no support for HTML. There is a [PR](https://github.com/prettier/prettier/pull/4753) but it doesn't support other HTML5 template syntaxes like Angular or Vue.
Prettyhtml should support formatting any valid HTML5 template without to corce or sanitize values but ensure a consistent output of your HTML.

## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
