![Prettyhtml Banner](/logo.png)

Prettyhtml is a general formatter for your Angular, Vue or pure HTML5 templates.

## Features

* Parse Angular, Vue or HTML5 templates.
* Formats embedded content with [prettier](https://github.com/prettier/prettier).
* Remove all superfluous white-space. 
* Enforce consistent output of your HTML.

## Packages

- [prettyhtml](/packages/prettyhtml) CLI and API.
- [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
- [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
- [prettyhtml-parse](https://github.com/StarpTech/parse5) HTML parser and serializer (fork of [parse5](https://github.com/inikulin/parse5))
- [prettyhtml-rehype-parse](/packages/prettyhtml-rehype-parse) Adapter between HTML parser and rehype.
- [prettyhtml-hast-util-from-parse](/packages/prettyhtml-hast-util-from-parse) Transform prettyhtml-parse AST to HAST.
- [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.

## Example
Test it on [repl.it](https://repl.it/@StarpTech/PrettyHtml)

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

## Wrapping

Prettyhtml does not wrap your code to a preset column. You can wrap elements by placing attributes on a newline.
We can improve this situation in the future but currently we don't see it as a blocker.

Multiline attributes
```html
<div id="test" 
  data-foo="foo" data-bar="bar">
```
**out**
```html
<div
  id="test" 
  data-foo="foo"
  data-bar="bar">
```
Multiline attribute values
```html
<div test="dddddddd
ddddddd" id="dwedwedwed"><p>foo</p></div>
```
**out**
```html
<div
  test="dddddddd
  ddddddd"
  id="dwedwedwed">
    <p>foo</p>
</div>
```

## Ideas?

Feel free to create an issue and show your proposal!

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
  useTabs: false,
  quote: `"`
})
```

## Ignore specific elments

```html
<!-- prettyhtml-ignore -->
<div></div>
```

## Why

Prettier has no intention to support other template syntaxes e.g like Angular or Vue. There is a [PR](https://github.com/prettier/prettier/pull/4753) but they is no agreement on it.
Prettyhtml should be able to format any superset of HTML as long it is parseable with minor tweaks.

## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
