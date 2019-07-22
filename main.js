const fs = require('mz/fs')
// TODO: My own rmdir-promise
const rmdir = require('rmdir-promise')
const cheerio = require('cheerio')
const minify = require('html-minifier').minify

const md = require('markdown-it')()
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
      const doc = {
        filename: pF,
        html: md.render(fs.readFileSync(`./static/posts/${pF}`, 'utf8'))
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
      $('#blog').html(`
        ${doc.html}
        <p><a href='../'>Back</a></p>
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
    console.log(`Compiling ${pF}...`)

    postPromises.push(transpilePost(pF))
  }

  return Promise.all(postPromises)
}

function buildHome (posts) {
  let home = ''
  for (const p of posts) {
    home += `<div class='title'><p>${p.title}</p></div>
              <div class='description'><p>${p.description}</p></div>
              <a href='./posts/${p.filename}.html'>Expand</a>`
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
    console.log('Loading template...')
    templateCode = fs.readFileSync('./static/index.html', 'utf8')

    // Create post pages
    const postFiles = await fs.readdir('./static/posts')
    const posts = await transpilePosts(postFiles)

    console.log('Creating homepage...')
    await fs.writeFile('./build/index.html', buildHome(posts))

    console.log(`🔥 Completed in ${epoch() - startEpoch}ms`)
  } catch (e) {
    console.error(`Whoops! What was that? 👎\n${e}`)
  }
}

main()
