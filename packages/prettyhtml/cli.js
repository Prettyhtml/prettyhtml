#!/usr/bin/env node

'use strict'

const PassThrough = require('stream').PassThrough
const notifier = require('update-notifier')
const meow = require('meow')
const engine = require('unified-engine')
const unified = require('unified')
const report = require('vfile-reporter')
const pack = require('./package')

// processing
const parse = require('rehype-parse')
const sortAttributes = require('rehype-sort-attributes')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter/formatter')

const extensions = ['html']

notifier({ pkg: pack }).notify()

var cli = meow(
  `
  Usage: prettyhtml [<glob> ...] [options ...],

  Options:

  -w, --why    output sources (when available)'
  -q, --quiet  output only warnings and errors'

  When no input files are given, searches for html templates
  files in the current directory, \`src\` and \`app\`.

  Examples
    $ echo "<element foo='bat'></element>" | prettyhtml
    $ prettyhtml *.html !example.html
    $ prettyhtml
  `,
  {
    autoHelp: true,
    autoVersion: true,
    flags: {
      quiet: {
        type: 'boolean',
        default: true,
        alias: 'q'
      },
      why: {
        type: 'boolean',
        alias: 'q'
      }
    }
  }
)

let globs = ['{src/**/,app/**/,}*.{' + extensions.join(',') + '}']

if (cli.input.length !== 0) {
  globs = cli.input
}

engine(
  {
    processor: unified()
      .use(parse, {
        fragment: true
      })
      .use(stringify),
    files: globs,
    extensions: extensions,
    configTransform: transform,
    output: true, // overwrite files
    out: false,
    streamError: new PassThrough(), // sink errors
    rcName: '.prettyhtmlrc',
    packageField: 'prettyhtml',
    ignoreName: '.prettyhtmlignore',
    frail: true,
    defaultConfig: transform()
  },
  (err, code, result) => {
    const out = report(err || result.files, {
      verbose: cli.flags.why,
      quiet: cli.flags.quiet
    })

    if (out) {
      console.error(out)
    }

    process.exit(code)
  }
)

function transform(options) {
  const plugins = [sortAttributes, format]
  return { plugins }
}
