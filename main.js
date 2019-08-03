const fs = require('mz/fs')
const hljs = require('highlight.js')
// TODO: My own rmdir-promise
const rmdir = require('rmdir-promise')
const cheerio = require('cheerio')
const minify = require('html-minifier').minify

const md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }

    return '' // use external default escaping
  }
})
  .use(require('markdown-it-container'), 'title')
  .use(require('markdown-it-container'), 'description')

const config = require('./config.json')

let templateCode

function mini (contents) {
  // TODO: Use more agressive minification
  return config.minify ? minify(contents, {
    collapseWhitespace: true,
    removeComments: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeRedundantAttributes: true
  }) : contents
}

const transpilePost = (pF) =>
  // eslint-disable-next-line
  new Promise(async (resolve, reject) => {
    try {
      const postFile = `./static/posts/${pF}`
      const doc = {
        filename: pF,
        html: md.render(fs.readFileSync(postFile, 'utf8')),
        creation: fs.statSync(postFile).birthtimeMs
      }

      // Title parser
      const $d = cheerio.load(doc.html)

      // eslint-disable-next-line
      function getCustomBlockText (blockName) {
        return $d(`.${blockName}`)[0].children[0].next.children[0].data
      }

      doc.title = getCustomBlockText('title')
      doc.description = getCustomBlockText('description')

      const $ = cheerio.load(templateCode)
      $('head').prepend(`<base href='../'>`)
      $('#blog').html(`
        ${doc.html}
        <a class='blogLink back' href='index.html'>Back</a>
      `)

      doc.fullPage = mini($.html())

      await fs.writeFile(`./build/posts/${pF}.html`, doc.fullPage)

      resolve(doc)
    } catch (e) {
      reject(e)
    }
  })

function transpilePosts (postFiles) {
  // TODO: Some form of date order
  const postPromises = []

  for (const pF of postFiles) {
    // TODO: Read async
    postPromises.push(transpilePost(pF))
  }

  return Promise.all(postPromises)
}

function buildHome (posts) {
  let home = ''
  for (const p of posts) {
    home += `<div class='homepage title'><p>${p.title}</p></div>
              <div class='homepage description'>${p.description}</div>
              <a class='blogLink expand' href='./posts/${p.filename}.html'>Expand</a>`
  }
  const $ = cheerio.load(templateCode)
  $('#blog').html(home)
  return mini($.html())
}

const epoch = () => (new Date()).getTime()
async function main () {
  try {
    const startEpoch = epoch()

    // Empty the build dir
    if (fs.existsSync('./build')) {
      await rmdir('./build')
    }
    await fs.mkdir('./build')
    await fs.mkdir('./build/posts')

    // Load template
    templateCode = fs.readFileSync('./static/index.html', 'utf8')

    // Create post pages
    const postFiles = await fs.readdir('./static/posts')
    const posts = await transpilePosts(postFiles)

    // Sort by creation date
    posts.sort((x, y) =>
      x.creation > y.creation ? -1 : 1
    )

    await fs.writeFile('./build/index.html', buildHome(posts))

    let resources = await fs.readdir('./static')
    resources = resources.filter((r) => r !== 'posts' && r !== 'index.html')

    const copies = []
    for (const r of resources) {
      // TODO: minify
      copies.push(fs.copyFile(`./static/${r}`, `./build/${r}`))
    }
    await Promise.all(copies)

    console.log(`🔥 Rebuilt in ${epoch() - startEpoch}ms`)
  } catch (e) {
    console.error(`Whoops! What was that? 👎\n${e}`)
  }
}

main()
