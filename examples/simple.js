const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(`<!-- custom -->
<my-component [icon]="'&#333'" >
</my-component>`)

console.log(result.contents)
