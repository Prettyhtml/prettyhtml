#!/usr/bin/env node

'use strict'

const PassThrough = require('stream').PassThrough
const { basename } = require('path')
const pack = require('./../package')
const { configTransform, processResult } = require('./processor')
const args = require('./args')
const prettier = require('prettier')
const engine = require('unified-engine')
const unified = require('unified')
const notifier = require('update-notifier')

function getDefaultSettings() {
  const settings = {
    extensions: ['html'],
    streamError: new PassThrough(), // sink errors
    rcName: '.prettyhtmlrc',
    packageField: 'prettyhtml',
    ignoreName: '.prettyhtmlignore',
    frail: false
  }
  return settings
}

module.exports = { getDefaultSettings }

// this was run directly from the command line
if (require.main === module) {
  notifier({ pkg: pack }).notify()

  const prettierConfig = prettier.resolveConfig.sync(process.cwd()) || {}
  const cli = args(prettierConfig)
  const settings = getDefaultSettings()
  settings.configTransform = configTransform
  settings.defaultConfig = configTransform({ prettierConfig, cli })
  settings.processor = unified()

  if (cli.flags.stdin === false) {
    if (cli.input.length === 0) {
      cli.showHelp()
    } else {
      settings.files = cli.input
      settings.output = true // Whether to overwrite the input files
      settings.out = false // Whether to write the processed file to streamOut

      engine(settings, processResult({ cli }))
    }
  } else {
    if (cli.input.length !== 0) {
      settings.output = basename(cli.input[0])
    }
    engine(settings, processResult({ cli }))
  }
}
