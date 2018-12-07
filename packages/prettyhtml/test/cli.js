const spawn = require('child_process').spawn
const test = require('ava')
const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname, './tmp')
const cliPath = path.join(__dirname, '../cli.js')

try {
  fs.mkdirSync(dir)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

test.cb('cli: single quotes', t => {
  fs.writeFile(
    path.join(dir, 'single-quote.html'),
    '<div id="foo" class=bar/>\n',
    err => {
      if (err) throw err
      const cp = spawn(cliPath, [
        'test/tmp/single-quote.html',
        '--single-quote'
      ])
      cp.on('close', function(code) {
        t.is(
          fs.readFileSync(path.join(dir, 'single-quote.html'), 'utf8'),
          "<div id='foo' class='bar'/>\n",
          'should use single instead of double quotes'
        )
        t.end()
      })
    }
  )
})

test.skip.cb('cli: sort attributes', t => {
  fs.writeFile(
    path.join(dir, 'sort-attributes.html'),
    '<div b="bar" a="foo"/>\n',
    err => {
      if (err) throw err
      const cp = spawn(cliPath, [
        'test/tmp/sort-attributes.html',
        '--sortAttributes'
      ])
      cp.on('close', function(code) {
        t.is(
          fs.readFileSync(path.join(dir, 'sort-attributes.html'), 'utf8'),
          '<div a="foo" b="bar"/>\n',
          'attributes should be sorted alphabetically'
        )
        t.end()
      })
    }
  )
})

test.always.after('cleanup', t => {
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
