const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<p>Some <code>  code  </code>, <em> emphasis </em>, and <br> <strong> importance </strong>
  .</p>
<custom [ngModel]="currentHero.name"
  (ngModelChange)="setUppercaseName($event)">
    <custom2 [ngModel]="currentHero.name"     (ngModelChange)="setUppercaseName($event)">   </custom2>
</custom>`
)

console.log(result.contents)
