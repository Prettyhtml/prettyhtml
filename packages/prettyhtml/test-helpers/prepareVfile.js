'use strict'

module.exports = prepareVfile

function prepareVfile(vfile) {
  vfile.cwd = 'skipped in tests'
  return vfile
}
