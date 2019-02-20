'use strict'

module.exports = prepareVfile

function prepareVfile(vfile) {
  // eslint-disable-next-line no-param-reassign
  vfile.cwd = 'skipped in tests'
  return vfile
}
