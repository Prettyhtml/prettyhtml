#!/usr/bin/env node

'use strict'

const program = require('commander')
const prettyhtml = require('@starptech/prettyhtml')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const git = require('./../lib/git')
const packageJSON = require('./../package.json')
const prettier = require('prettier')

program
  .version(packageJSON.version)
  .option(
    '-s, --staged',
    'Only staged files will be formatted, and they will be re-staged after formatting'
  )
  .parse(process.argv)

const cwd = process.cwd()
const prettierConfig = prettier.resolveConfig.sync(cwd)
const root = git.detect(cwd)
const revision = git.getSinceRevision(root, { staged: program.staged })
const changedFiles = program.staged
  ? git.getStagedChangedFiles(root)
  : git.getUnstagedChangedFiles(root)

// only html files
const htmlFiles = changedFiles.filter(filename =>
  /.+\.html|.htm$/.test(filename)
)

// same prettyhtml defaults
const prettyhtmlCfg = {
  printWidth: prettierConfig.printWidth,
  tabWidth: prettierConfig.tabWidth,
  prettier: prettierConfig,
  wrapAttributes: prettierConfig.wrapAttributes,
  sortAttributes: prettierConfig.sortAttributes
}

if (htmlFiles.length) {
  console.log(
    `🔍  Finding changed files since ${chalk.bold('git')} revision ${chalk.bold(
      revision
    )}.`
  )
}

console.log(
  `🎯  Found ${chalk.bold(htmlFiles.length)} changed ${
    htmlFiles.length === 1 ? 'file' : 'files'
  }.
    ☝  printWidth: ${prettyhtmlCfg.printWidth ||
      80}, tabWidth: ${prettyhtmlCfg.tabWidth || 2}`
)

htmlFiles.forEach(file => {
  const filePath = path.join(root, file)
  let input = fs.readFileSync(filePath, 'utf8')
  try {
    const vFile = prettyhtml(input, prettyhtmlCfg)
    fs.writeFileSync(filePath, vFile.contents, 'utf8')
    git.stageFile(cwd, file)
    console.log(`✍️  Fixing up ${chalk.bold(file)}.`)
  } catch (error) {
    console.log(`❌  Error: ${chalk.bold(error.message)}.`)
  }
})

console.log('✅  Everything is awesome!')
