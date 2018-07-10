const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(`<form>
<div test="dddddddd
ddddddd" id="dwedwedwed"><p>foo</p></div>
</form>
<form>
<div test="dddddddd
ddddddd"><p>foo</p></div>
</form>`)

console.log(result.contents)
