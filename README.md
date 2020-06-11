# syntax-highlight
Custom Element to do simple syntax highlighting, 2kb in sizes to help you visualizing code examples on your website.

## Installation
Include the Javascript file (either `syntax-highlight.js` OR minified version `syntax-highlight.min.js`) in your HTML:
```html
<script src="syntax-highlight.min.js"></script>
```

## Use the web component
Add a `syntax-highlight` tag and insert the source code you want to be highlighted as its inner HTML.

```html
<syntax-highlight>
const y = 'Yeah!';
var scream = function(text){
  console.log(text)
}
scream(y);
</syntax-highlight>
```

See the included `index.html` file as an example or see it in action at [https://stefanreimers.github.io/syntax-highlight/](https://stefanreimers.github.io/syntax-highlight/).

## Credits
Based on the [microlight](https://github.com/asvd/microlight) library and using the [styling considerations](https://css-tricks.com/considerations-styling-pre-tag/) for the `pre` tag.
