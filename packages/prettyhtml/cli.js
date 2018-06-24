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
const parse = require('@starptech/prettyhtml-rehype-parse')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')

const extensions = ['html']

notifier({ pkg: pack }).notify()

var cli = meow(
  `
  Usage: prettyhtml [<glob> ...] [options ...],

  Options:

  --tab-width     Specify the number of spaces per indentation-level
  --print-width   Specify the line length that the printer will wrap on
  --why           output sources (when available)'
  --quiet         output only warnings and errors'

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
      tabWidth: {
        type: 'number',
        default: 2
      },
      printWidth: {
        type: 'number',
        default: 80
      },
      quiet: {
        type: 'boolean',
        default: true
      },
      why: {
        type: 'boolean'
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
    processor: unified(),
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
  const plugins = [
    [parse, { fragment: true }],
    [stringify, { customElAttrIndent: cli.flags.tabWidth }],
    [format, { indent: cli.flags.tabWidth, printWidth: cli.flags.printWidth }]
  ]
  return { plugins }
}
