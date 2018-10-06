const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<!--prettyhtml-ignore--><form #heroForm (ngSubmit)="onSubmit(heroForm)">       <input type="text" [(onChange)]="dede" name="test" /><button [style.color]="isSpecial ? 'red' : 'green'"></button></form><div class="ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"></div>`
)

console.log(result)
