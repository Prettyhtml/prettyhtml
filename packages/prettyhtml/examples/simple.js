const prettyhtml = require('..')
const { writeFileSync, readFileSync } = require('fs')

// example with angular template syntax
const result = prettyhtml(readFileSync('./examples/simple.html'))

writeFileSync('./examples/result.html', result, 'utf8')
