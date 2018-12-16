#!/usr/bin/env node

'use strict'

const PassThrough = require('stream').PassThrough
const notifier = require('update-notifier')
const engine = require('unified-engine')
const unified = require('unified')
const { basename } = require('path')
const pack = require('./../package')
const prettier = require('prettier')
const args = require('./args')
const { transform, processor } = require('./processor')

const extensions = ['html']

notifier({ pkg: pack }).notify()

const prettierConfig = prettier.resolveConfig.sync(process.cwd()) || {}
const cli = args(prettierConfig)

const settings = {
  processor: unified(),
  extensions: extensions,
  configTransform: transform,
  streamError: new PassThrough(), // sink errors
  rcName: '.prettyhtmlrc',
  packageField: 'prettyhtml',
  ignoreName: '.prettyhtmlignore',
  frail: false,
  defaultConfig: transform({ prettierConfig, flags: cli.flags })
}

const processResult = processor({ flags: cli.flags })

if (cli.flags.stdin === false) {
  if (cli.input.length === 0) {
    cli.showHelp()
  } else {
    settings.files = cli.input
    settings.output = true // Whether to overwrite the input files
    settings.out = false // Whether to write the processed file to streamOut

    engine(settings, processResult)
  }
} else {
  if (cli.input.length !== 0) {
    settings.output = basename(cli.input[0])
  }
  engine(settings, processResult)
}
