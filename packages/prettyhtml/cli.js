#!/usr/bin/env node

'use strict'

const PassThrough = require('stream').PassThrough
const notifier = require('update-notifier')
const meow = require('meow')
const engine = require('unified-engine')
const unified = require('unified')
const report = require('vfile-reporter')
const { basename } = require('path')
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

  --tab-width       Specify the number of spaces per indentation-level
  --print-width     Specify the line length that the printer will wrap on
  --stdin-filepath  Specify the input filepath. This will be used to do parser inference.
  --why             Output sources (when available)
  --quiet           Output only warnings and errors

  Examples
    $ prettyhtml *.html
    $ prettyhtml *.html !example.html
    $ echo "<custom foo='bat'></custom>" | prettyhtml
    $ echo "<custom foo='bat'></custom>" --stdin-filepath ./test.html
  `,
  {
    autoHelp: true,
    autoVersion: true,
    flags: {
      tabWidth: {
        type: 'number',
        default: 2
      },
      stdinFilepath: {
        type: 'boolean',
        default: false
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

const settings = {
  processor: unified(),
  extensions: extensions,
  configTransform: transform,
  streamError: new PassThrough(), // sink errors
  rcName: '.prettyhtmlrc',
  packageField: 'prettyhtml',
  ignoreName: '.prettyhtmlignore',
  frail: true,
  defaultConfig: transform()
}

if (cli.flags.stdinFilepath === false) {
  settings.files = cli.input
  settings.output = true // Whether to overwrite the input files
  settings.out = false // Whether to write the processed file to streamOut

  engine(settings, processResult)
} else {
  if (cli.input.length !== 0) {
    settings.output = basename(cli.input[0])
  }
  engine(settings, processResult)
}

function processResult(err, code, result) {
  const out = report(err || result.files, {
    verbose: cli.flags.why,
    quiet: cli.flags.quiet
  })

  if (out) {
    console.error(out)
  }

  process.exit(code)
}

function transform(options) {
  const plugins = [
    [parse, { fragment: true }],
    [stringify, { customElAttrIndent: cli.flags.tabWidth }],
    [format, { indent: cli.flags.tabWidth, printWidth: cli.flags.printWidth }]
  ]
  return { plugins }
}
