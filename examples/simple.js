const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<html><form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test" /><button [style.color]="isSpecial ? 'red' : 'green'"></button></form></html>`
)

console.log(result)
