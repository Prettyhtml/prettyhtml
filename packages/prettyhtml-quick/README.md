# prettyhtml-quick

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

```shellsession
npm install --save-dev @starptech/prettyhtml-quick
```

## Usage

With [`npx`](https://npm.im/npx): (No install required)

```shellsession
npx @starptech/prettyhtml-quick
```

## Pre-Commit Hook

You can run `prettyhtml-quick` as a pre-commit hook using [`husky`](https://github.com/typicode/husky).

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
