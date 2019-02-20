'use strict'

const { PassThrough } = require('stream')

module.exports = spy

function spy() {
  const stream = new PassThrough()
  const output = []
  const originalWrite = stream.write

  stream.write = write

  done.stream = stream

  return done

  function write(chunk, encoding, callback) {
    const cb = typeof encoding === 'function' ? encoding : callback

    if (typeof cb === 'function') {
      setImmediate(cb)
    }

    output.push(chunk)
  }

  function done() {
    stream.write = originalWrite

    return output.join('')
  }
}
