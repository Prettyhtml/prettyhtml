const spawn = require('child_process').spawn
const test = require('ava')
const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname, './tmp')

try {
  fs.mkdirSync(dir)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

test.cb('cli', t => {
  fs.writeFile(
    path.join(dir, 'single-quote.html'),
    '<div id="foo" class=bar/>\n',
    err => {
      if (err) throw err
      const cp = spawn('./cli.js', [
        'test/tmp/single-quote.html',
        '--single-quote'
      ])
      cp.on('close', function(code) {
        t.is(
          fs.readFileSync(path.join(dir, 'single-quote.html'), 'utf8'),
          "<div id='foo' class='bar'/>\n",
          'double and unquoted attribute values should be replaced with single quotes'
        )
        t.end()
      })
    }
  )
})

test.after('cleanup', t => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlinkSync(path.join(dir, file), err => {
        if (err) throw err
      })
    }

    fs.rmdirSync(dir)
  })
})
