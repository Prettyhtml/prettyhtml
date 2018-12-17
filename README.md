![Prettyhtml Banner](/logo.png)

[![Build Status](https://dev.azure.com/prettyhtml/Prettyhtml/_apis/build/status/Prettyhtml.prettyhtml)](https://dev.azure.com/prettyhtml/Prettyhtml/_build/latest?definitionId=1)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![npm version](https://badge.fury.io/js/%40starptech%2Fprettyhtml.svg)](https://badge.fury.io/js/%40starptech%2Fprettyhtml)

Opinionated general formatter for your Angular, Vue, Svelte or pure HTML5 templates. Try it on the [playground](https://prettyhtml.netlify.com/).

## Features

- Indentation based primary on node-level + tag length, not content.
- Can parse Angular, Vue or HTML5 templates.
- Formats embedded content with [prettier](https://github.com/prettier/prettier) with respect to your local settings.
- Doesn't change the behaviour of your attributes and tags.
- Remove all superfluous white-space. There are two additional rules:
  - Collapses multiple blank lines into a single blank line.
  - Empty lines at the start and end of blocks are removed. (Files always end with a single newline, though.)
- Enforce consistent output of your HTML.

## Framework specific features

| Feature                         | Framework |
| ------------------------------- | --------- |
| HTML5                           | all       |
| Self-closing custom elements    | vue       |
| Self-closing none void elements | vue       |
| Case-sensitive attributes       | angular   |
| Case-sensitive elements         | angular   |

## Packages

- [prettyhtml](/packages/prettyhtml) CLI and API.
- [prettyhtml-formatter](/packages/prettyhtml-formatter) Formatter.
- [prettyhtml-hast-to-html](/packages/prettyhtml-hast-to-html) Stringifier.
- [prettyhtml-hastscript](/packages/prettyhtml-hastscript) Hyperscript compatible DSL for creating virtual HAST trees.
- [prettyhtml-sort-attributes](/packages/prettyhtml-sort-attributes) Sort attributes alphabetically.
- [prettyhtml-quick](/packages/prettyhtml-quick) Formats your changed files based on Git.
- [webparser](/packages/webparser) Optimized HTML parser for formatters
- [expression-parser](/packages/expression-parser) Framework agnostic template expression parser.
- [rehype-webparser](/packages/rehype-webparser) Adapter between HTML parser and rehype.
- [rehype-minify-whitespace](/packages/rehype-minify-whitespace) Collapse whitespace.
- [hast-util-from-parse](/packages/hast-util-from-webparser) Transform [webparser](/packages/webparser) AST to HAST.

## Ignore element

Adding this flag before a tag will preserve from whitespace and/or attribute wrapping.

1. Preserve from indentation, whitespace and attribute wrapping

```html
<!--prettyhtml-ignore-->
<div></div>
```

2. Preserve only from whitespace processing. This excludes indentation.

```html
<!--prettyhtml-preserve-whitespace-->
<h1> foo </h1>
```

3. Preserve only from attribute wrapping

```html
<!--prettyhtml-preserve-attribute-wrapping-->
<h1 foo="bar" ...> foo </h1>
```

## Install

```bash
# regular
$ npm install @starptech/prettyhtml --global

# when using proxy like sinopia/verdaccio
$ npm install @starptech/prettyhtml --global --registry=https://registry.npmjs.org/
```

## CLI

This will process recursively all HTML files in the current directory.

```
$ prettyhtml example.html "./**/*.html"
```

### Help

```
$ prettyhtml --help
```

## Pre-Commit hook integration

We provide a simple package called [prettyhtml-quick](/packages/prettyhtml-quick) which is able to format only changed files. This example use [husky](https://github.com/typicode/husky) to manage git hooks in the package.json

```json
{
  "husky": {
    "hooks": {
      "precommit": "prettyhtml-quick --staged"
    }
  }
}
```

## API

## `prettyhtml(doc: string, options?): vFile`

Formats a string and returns a [`vFile`](https://github.com/vfile/vfile). The method can throw e.g when a parsing error was produced. The error is from type [`vfile-message`](https://github.com/vfile/vfile-message).

##### `options`

###### `options.tabWidth`

The space width of your indentation level (default: 2)

###### `options.useTabs`

Use tabs instead spaces for indentation (default: false)

###### `options.printWidth`

Use different maximum line length (default: 80)

###### `options.usePrettier`

Use prettier for embedded content (default: true)

###### `options.prettier`

Use custom prettier settings for embedded content (default: local config)

###### `options.singleQuote`

Use single quote instead double quotes (default: false)

###### `options.wrapAttributes`

Force to wrap attributes (when it has multiple, default: false)

###### `options.sortAttributes`

Sort attributes alphabetically (default: false)

## Editor support

- [VSCode](https://github.com/StarpTech/prettyhtml-vscode) extension (not published yet)
- [Vetur](https://vuejs.github.io/vetur/formatting.html#formatters) Vue tooling for VS Code

## Why

Prettier has [landed](https://github.com/prettier/prettier/releases/tag/1.15.0) HTML support some days ago. This is awesome and will help many people to reduce the headache of correct formatting in teams. The reason why I still using prettyhtml is clear:

- It is very easy to maintain because we have a [specification](https://github.com/syntax-tree/hast) and an [ecosystem](https://github.com/rehypejs/rehype) (and @vfile, @syntax-tree) of plugins.
- It should be able to format any superset of HTML as long it is parseable with minor tweaks. We use a modified version of the Angular 6 template parser. There is no need to maintain multiple parser.
- Prettyhtml doesn't try to understand all Javascript frameworks in depth even when it means that the user has to update some places manually.

## Acknowledgement

Big thanks to the creators of the excellent [rehype](https://github.com/rehypejs/rehype) and [unified](https://github.com/unifiedjs/unified) ecosystem.
