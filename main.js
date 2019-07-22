const fs = require('mz/fs')
// TODO: My own rmdir-promise
const rmdir = require('rmdir-promise')
const cheerio = require('cheerio')
const minify = require('html-minifier').minify
const md = require('markdown-it')()

const config = require('./config.json')

let templateCode

const transpilePost = (pF) =>
  // eslint-disable-next-line
  new Promise(async (resolve, reject) => {
    try {
      const doc = {
        title: 'Test',
        description: 'a post',
        filename: pF,
        html: md.render(fs.readFileSync(`./static/posts/${pF}`, 'utf8'))
      }

      const $ = cheerio.load(templateCode)
      $('#blog').html(`
        ${doc.html}
        <p><a href='../'>Back</a></p>
      `)

      // TODO: Use more agressive minification
      const html = $.html()
      doc.fullPage = config.minify ? minify(html, {
        collapseWhitespace: true,
        removeComments: true
      }) : html

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
    home += `<h2>${p.title}</h2>
              <p>${p.description}</p>
              <a href='./posts/${p.filename}.html'>Expand</a>`
  }
  const $ = cheerio.load(templateCode)
  $('#blog').html(home)
  fs.writeFile('./build/index.html', $.html())
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
    buildHome(posts)

    console.log(`🔥 Completed in ${epoch() - startEpoch}ms`)
  } catch (e) {
    console.error(`Whoops! What was that? 👎\n${e}`)
  }
}

main()
