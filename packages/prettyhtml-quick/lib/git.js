'use strict'

const execa = require('execa')
const path = require('path')
const findUp = require('find-up')

module.exports.detect = directory => {
  const gitDirectory = findUp.sync('.git', { cwd: directory })
  if (gitDirectory) {
    return path.dirname(gitDirectory)
  }
}

const runGit = (directory, args) =>
  execa.sync('git', args, {
    cwd: directory
  })

const getLines = execaResult => execaResult.stdout.split('\n')

module.exports.getSinceRevision = (directory, opts) => {
  try {
    const revision = opts.staged
      ? 'HEAD'
      : runGit(directory, ['merge-base', 'HEAD', opts.branch || 'master']).stdout.trim()
    return runGit(directory, ['rev-parse', '--short', revision]).stdout.trim()
  } catch (error) {
    if (/HEAD/.test(error.message) || (opts.staged && /Needed a single revision/.test(error.message))) {
      return null
    }
    throw error
  }
}

module.exports.getChangedFiles = (directory, revision, staged) => {
  const a = getLines(
    runGit(
      directory,
      ['diff', '--name-only', staged ? '--cached' : null, '--diff-filter=ACMRTUB', revision].filter(Boolean)
    )
  )

  const b = staged ? [] : getLines(runGit(directory, ['ls-files', '--others', '--exclude-standard']))

  return a.concat(b).filter(Boolean)
}

module.exports.getUnstagedChangedFiles = directory => {
  return module.exports.getChangedFiles(directory, null, false)
}

module.exports.getStagedChangedFiles = directory => {
  return module.exports.getChangedFiles(directory, null, true)
}

module.exports.stageFile = (directory, file) => {
  runGit(directory, ['add', file])
}
