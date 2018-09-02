'use strict'

var fs = require('fs')
var path = require('path')
var test = require('ava')
var not = require('not')
var hidden = require('is-hidden')
var vfile = require('to-vfile')
var parse5 = require('@starptech/prettyhtml-parse')
var visit = require('unist-util-visit')
var fromParse5 = require('..')

var join = path.join

var base = join('test', 'fixtures')

fs.readdirSync(base)
  .filter(not(hidden))
  .forEach(each)

function each(fixture) {
  test(fixture, function(t) {
    var opts = {
      file: vfile.readSync(join(base, fixture, 'index.html')),
      out: join(base, fixture, 'index.json')
    }

    t.plan(1)

    check(t, fixture, opts)
  })
}

function check(t, fixture, options) {
  var input = parse5.parse(String(options.file), {
    sourceCodeLocationInfo: true
  })
  var actual = fromParse5(input, { file: options.file, verbose: true })
  var expected

  try {
    expected = JSON.parse(fs.readFileSync(options.out))
  } catch (err) {
    /* New fixture. */
    fs.writeFileSync(options.out, JSON.stringify(actual, 0, 2) + '\n')
    return
  }

  t.deepEqual(actual, expected, 'p5 w/ position, hast w/ intent of position')
}

function clean(tree) {
  visit(tree, cleaner)
}

function cleaner(node) {
  delete node.position

  /* Remove verbose data */
  if (node.type === 'element') {
    delete node.data
  }

  if (node.content) {
    clean(node.content)
  }
}
