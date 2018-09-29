<div align="center">
<h1>@starptech/prettyhtml-hastscript</h1>
<i><b>Hyperscript compatible DSL for creating virtual HAST trees</b></i>
<p>The implementation is a derivated from <a href="https://github.com/syntax-tree/hastscript">hastscript (Version 4.0.0)</a></p>
</div>
<br>

<div align="center">
<code>npm install --save @starptech/prettyhtml-hastscript</code>
</div>
<br>

<p align="center">
  📖 <a href="https://github.com/syntax-tree/hastscript"><b>Documentation</b></a> 📖
</p>


## Modifications

* Don't coerce or optimize attribute values
* Don't house `<template>` node through `content` property. Handle it like any other element.

## Caveats

* Known html attributes aren't handled case-sensitively
