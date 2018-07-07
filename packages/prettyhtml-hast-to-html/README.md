<div align="center">
<h1>@starptech/prettyhtml-hast-to-html</h1>
<i><b><a href="https://github.com/syntax-tree/hast">HAST</a> to HTML converter</b></i>
<p>The implementation is a derivated from <a href="https://github.com/syntax-tree/hast-util-to-html">ast-util-to-html (Version 3.1.0)</a> with the goal to stringify nodes in a custom way.</p>
</div>
<br>

<div align="center">
<code>npm install --save @starptech/prettyhtml-hast-to-html</code>
</div>


### Modifications

* Don't kebab case on custom element attributes.
* Indent attributes of custom elements with 2 spaces.
* Insert newline for closing custom element tags when element has attributes or child nodes.
* Don't encode attribute values
* Don't omit value behind boolean attributes
