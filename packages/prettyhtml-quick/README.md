# `prettyhtml-quick`

Runs [Prettyhtml](https://github.com/Prettyhtml/prettyhtml) on your changed (based on Git) files.

Example:
```
prettyhtml-quick
🔍  Finding changed files since git revision 2eb4337.
🎯  Found 1 changed file.
    ☝  printWidth: 80, tabWidth: 2
✍️  Fixing up test.html.
✅  Everything is awesome!
```

## Install

With `npm`:

```shellsession
npm install --save-dev prettyhtml-quick
```

## Usage

With [`npx`](https://npm.im/npx): (No install required)

```shellsession
npx prettyhtml-quick
```

With `npm`:

1. Add `"prettyhtml-quick": "prettyhtml-quick"` to the scripts section of `package.json`.
2. `npm run format:staged`

## Pre-Commit Hook

You can run `prettyhtml-quick` as a pre-commit hook using [`husky`](https://github.com/typicode/husky).

> For Mercurial have a look at [`husky-hg`](https://github.com/TobiasTimm/husky-hg)

```shellstream
yarn add --dev husky
```

In `package.json`'s `"scripts"` section, add:

```
"precommit": "prettyhtml-quick"
```

## CLI Flags

### `-s --staged`

Only staged files will be formatted, and they will be re-staged after formatting.

## Formatter options

We use prettier [`resolveConfig`](https://prettier.io/docs/en/api.html#prettierresolveconfigfilepath-options) to indentify your tabWidth and printWidth. It will fallback to `.editorconfig`.
