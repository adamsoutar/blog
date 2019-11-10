# My blog builder

This is my static markdown -> blog builder. It creates a site that runs without requiring
Javascript, nor **any** external libraries or tools - JQuery, React or otherwise.

It builds a superfast site with minified, self contained pages for every post, as well as building an index page.

## How does it work?

Create a template, then write posts in markdown.
Everything else is done automatically.

```html
<html>
  <body>
    <!-- Code-generated content is injected here -->
    <div id='blog'></div>
  </body>
</html>
```

For a detailed explanation of how the blog builder works, see the post on
... [my blog](http://overflo.me/posts/theBlogBuilder.md.html)!

## Example

It runs http://overflo.me , my website.

## This repo

This repo actually is my blog. `main.js` is the blog builder.
Anything within `static/` , which includes the posts, is related
specifically to my blog.
