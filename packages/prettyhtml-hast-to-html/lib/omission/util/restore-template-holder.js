'use strict'

module.exports = replace

function replace(value, holder) {
  if (value.indexOf(holder) !== -1) {
    const startTag = new RegExp('<' + holder + '(.*)>', 'g')
    const endTag = new RegExp('</' + holder + '(.*)>', 'g')
    return value
      .replace(startTag, '<template$1>')
      .replace(endTag, '</template>')
  }

  return value
}
