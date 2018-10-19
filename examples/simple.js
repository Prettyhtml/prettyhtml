const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
try {
  const result = prettyhtml(
    `<form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test" /><button [style.color]="isSpecial ? 'red' : 'green'"></button></form>`
  )
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
