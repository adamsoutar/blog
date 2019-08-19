::: title
The blog builder that runs this site
:::

::: description
This site is built from markdown to static pages by a custom-written script.
:::

I love writing Markdown, it's a quick and easy way to write down your thoughs.
So when I needed a place to write down thoughts, that's what I settled for
instantly.

At the moment, I have a node script that builds a static and extremely quick blog
from markdown files.

## The system

First, you create a template html file, ensuring it contains a div with id `blog`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Adam's blog</title>
  </head>
  <body>
    <!-- Blog is injected here in the build stage -->
    <div id='blog'></div>
  </body>
</html>
```

The markdown is transpiled with npm package `markdown-it` and `highlight.js`
for syntax highlighting within code blocks - I use highligh.js's Atom One Dark
CSS file for the colours.

After building the HTML, I have an array of the posts (using `fs.stat` to get
the file creation date and sort the posts by date).

``` js
[
  {
    name: 'The blog builder that runs this site',
    description: 'This site is built from markdown.',
    creation: 1563808266790.4578,
    html: '<p>...'
  }
]
```

Then, the HTML is put into the template using `cheerio`, a virtual DOM + JQuery
implementation for node.

Finally, the extra files from the static folder are copied to the build folder.
The format is so:

```
static
  - posts
    - post1.md
    - post2.md
  - index.html
  - style.css
```

## Client side

On the client side, the only JS used is to enable the dark theme switch.
The state of the dark theme is saved in `localStorage`. On load, the variable
is used to determine whether we should append a `<link href='darkTheme.css'>`.
