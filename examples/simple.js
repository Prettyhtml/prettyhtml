const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(`<!-- custom -->
<my-component ng-model="selected"><custom FOO="test" class="test" title="title"></custom>
<form #heroForm (ngSubmit)="onSubmit(heroForm)" title="title" data-foo="foo" data-baz="baz"> <input
type="text" [(onChange)]="dede" name="test"> <button [style.color]="isSpecial ? 'red' : 'green'"></button>
<div>Foo bar test</div>
</form>
</my-component>`)

console.log(result.contents)
