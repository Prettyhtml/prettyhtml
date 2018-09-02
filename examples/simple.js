const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<div id="'test'"></div>
`,
  {
    singleQuote: true
  }
)

console.log(result)
