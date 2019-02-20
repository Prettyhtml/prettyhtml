// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava')
const engine = require('unified-engine')
const unified = require('unified')
const { Readable } = require('stream')
const { configTransform } = require('../cli/processor')
const { getDefaultSettings } = require('../cli')
const spy = require('../test-helpers/util')
const args = require('../cli/args')
const prepareVfile = require('../test-helpers/prepareVfile')

test.cb('Should format with default settings', t => {
  const stream = new Readable()
  // eslint-disable-next-line no-underscore-dangle
  stream._read = () => {}
  stream.push(
    `<form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test" /><button [style.color]="isSpecial ? 'red' : 'green'"></button></form>`
  )
  stream.push(null)

  const stderr = spy()
  const stdout = spy()

  const prettierConfig = {}
  const cli = args(prettierConfig)
  const settings = getDefaultSettings({ prettierConfig, cli })
  settings.configTransform = configTransform
  settings.defaultConfig = configTransform({ prettierConfig, cli })
  settings.processor = unified()
  settings.streamIn = stream
  settings.streamError = stderr.stream
  settings.streamOut = stdout.stream

  engine(
    Object.assign(settings, {
      streamIn: stream,
      streamError: stderr.stream
    }),
    (err, code, result) => {
      t.falsy(err)
      t.deepEqual([stderr(), code], ['<stdin>: no issues found\n', 0])
      t.snapshot(prepareVfile(result.files[0]))
      t.end()
    }
  )
})

test('Should use correct default settings when no prettier settings was provided', t => {
  const prettierConfig = {}
  const cli = args(prettierConfig)
  t.deepEqual(cli.flags, {
    printWidth: 80,
    quiet: false,
    silent: false,
    singleQuote: false,
    sortAttributes: false,
    stdin: false,
    tabWidth: 2,
    usePrettier: true,
    useTabs: false,
    wrapAttributes: false
  })
})

test('Should use correct settings when prettier settings was provided', t => {
  const prettierConfig = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    useTabs: true
  }
  const cli = args(prettierConfig)
  t.deepEqual(cli.flags, {
    printWidth: 120,
    quiet: false,
    silent: false,
    // Dont let it override by prettier settings because `"` is best practice in HTML
    singleQuote: false,
    sortAttributes: false,
    stdin: false,
    tabWidth: 4,
    usePrettier: true,
    useTabs: true,
    wrapAttributes: false
  })
})

test('Should transform config in unified pipes', t => {
  const prettierConfig = {}
  const cli = args(prettierConfig)
  const config = configTransform({ prettierConfig, cli })
  t.is(config.plugins.length, 3)
})

test('Should add sortAttributes plugin to the config', t => {
  const prettierConfig = { sortAttributes: true }
  const cli = args(prettierConfig)
  const config = configTransform({ prettierConfig, cli })
  t.is(config.plugins.length, 4)
})

test('Should add sortAttributes plugin to the config when it was passed as a flag', t => {
  const prettierConfig = {}
  const cli = args(prettierConfig)
  cli.flags.sortAttributes = true
  const config = configTransform({ prettierConfig, cli })
  t.is(config.plugins.length, 4)
})
