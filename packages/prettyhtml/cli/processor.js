const parse = require('@starptech/rehype-webparser')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const sortAttributes = require('@starptech/prettyhtml-sort-attributes')
const format = require('@starptech/prettyhtml-formatter')
const report = require('vfile-reporter')

function processor({ flags }) {
  return function processResult(err, code, result) {
    const out = report(err || result.files, {
      quiet: flags.quiet,
      silent: flags.silent
    })

    if (out) {
      console.error(out)
    }

    process.exit(code)
  }
}

function transform({ prettierConfig, flags }) {
  const plugins = [
    [
      parse,
      {
        ignoreFirstLf: false,
        decodeEntities: false,
        selfClosingCustomElements: true,
        selfClosingElements: true
      }
    ],
    [
      format,
      {
        tabWidth: flags.tabWidth,
        useTabs: flags.useTabs,
        singleQuote: flags.singleQuote,
        usePrettier: flags.usePrettier,
        prettier: prettierConfig
      }
    ]
  ]

  if (flags.sortAttributes || prettierConfig.sortAttributes) {
    plugins.push([sortAttributes, {}])
  }

  plugins.push([
    stringify,
    {
      tabWidth: flags.tabWidth,
      printWidth: flags.printWidth,
      singleQuote: flags.singleQuote,
      wrapAttributes: flags.wrapAttributes
    }
  ])

  return { plugins }
}

module.exports = { transform, processor }
