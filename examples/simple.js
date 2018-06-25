const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<!-- custom --><custom [ngModel]="currentHero.name" class="b c a"
  (ngModelChange)="setUppercaseName($event)">
    <custom2 [ngModel]="currentHero.name"     (ngModelChange)="setUppercaseName($event)">   </custom2>
</custom>
<p>Some <code>  code  </code>, <em> emphasis </em>, and <br> <strong> importance </strong>
  .</p>`
)

console.log(result.contents)
