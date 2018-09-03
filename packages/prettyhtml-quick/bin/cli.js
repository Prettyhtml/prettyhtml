#!/usr/bin/env node

'use strict'

const program = require('commander')

const prettyhtml = require('@starptech/prettyhtml')
const sgf = require('staged-git-files')
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

const prettierConfig = prettier.resolveConfig.sync(process.cwd())
const root = git.detect(process.cwd())
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
  printWidth: prettierConfig.printWidth || 80,
  tabWidth: prettierConfig.tabWidth || 2
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
    ☝  printWidth: ${prettyhtmlCfg.printWidth}, tabWidth: ${
    prettyhtmlCfg.tabWidth
  }`
)

for (let i = 0; i < htmlFiles.length; i++) {
  const file = htmlFiles[i]
  const filePath = path.join(root, file)

  let input = fs.readFileSync(filePath, 'utf8')
  const result = prettyhtml(input, prettyhtmlCfg)
  fs.writeFileSync(filePath, result, 'utf8')
  git.stageFile(sgf.cwd, file)

  console.log(`✍️  Fixing up ${chalk.bold(file)}.`)
}

console.log('✅  Everything is awesome!')
