const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(`  <link rel="manifest" href="site.webmanifest">

<!-- Place favicon.ico in the root directory -->
<link rel="apple-touch-icon" href="icon.png">`)

console.log(result.contents)
