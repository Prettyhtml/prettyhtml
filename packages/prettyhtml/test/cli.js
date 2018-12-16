const test = require('ava')
const path = require('path')
const { writeFileSync, readFileSync } = require('fs')
const { spawnSync } = require('child_process')

const inputFile = path.join(__dirname, 'fixtures', 'default', 'input.html')
const outputFile = path.join(__dirname, 'fixtures', 'default', 'output.html')
const inputData = readFileSync(inputFile)
const cliPath = path.join(__dirname, '..', 'cli', 'index.js')

test.afterEach.always(t => {
  writeFileSync(inputFile, inputData)
})

test('Should format with default settings', t => {
  writeFileSync(
    inputFile,
    '<form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test"><button [style.color]="isSpecial ? \'red\' : \'green\'"></button></form>'
  )
  const argv = [cliPath, inputFile]
  const result = spawnSync('node', argv)

  t.is(result.status, 0)
  t.is(readFileSync(inputFile, 'utf8'), readFileSync(outputFile, 'utf8'))
})
