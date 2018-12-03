const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
try {
  const result = prettyhtml(`<p>dwedwedw</p>`)
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
