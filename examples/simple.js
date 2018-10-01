const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<div id="app">
  <div class="header">
<button @click="prettify">Prettify</button>
</div>
  <div style="display:flex">
<prism-editor class="my-editor" :code="code" @change="changeCode" language="html" />
<prism-editor :code="result" language="html" />
</div>
</div>`,
  {
    useTabs: true
  }
)

console.log(result)
