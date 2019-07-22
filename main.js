const fs = require('mz/fs')
// TODO: My own rmdir-promise
const rmdir = require('rmdir-promise')
const cheerio = require('cheerio')
const minify = require('html-minifier').minify
const md = require('markdown-it')()

const config = require('./config.json')

async function main () {
  // Empty the build dir
  if (fs.existsSync('./build')) {
    await rmdir('./build')
  }
  await fs.mkdir('./build')
  await fs.mkdir('./build/posts')

  // Load template
  console.log('Loading template...')
  const templateCode = fs.readFileSync('./static/index.html', 'utf8')

  // Create post pages
  const posts = []
  const postFiles = await fs.readdir('./static/posts')

  for (const pF of postFiles) {
    // TODO: Read async

    console.log(`Compiling ${pF}...`)
    const doc = {
      title: 'Test',
      filename: pF,
      html: md.render(fs.readFileSync(`./static/posts/${pF}`, 'utf8'))
    }

    const $ = cheerio.load(templateCode)
    $('#blog').html(doc.html)

    // TODO: Use more agressive minification
    const html = $.html()
    doc.fullPage = config.minify ? minify(html, {
      collapseWhitespace: true,
      removeComments: true
    }) : html

    posts.push(doc)
  }

  // Write post files
  const writePromises = []
  for (const p of posts) {
    writePromises.push(
      fs.writeFile(`./build/posts/${p.filename}.html`, p.fullPage)
    )
  }
  await Promise.all(writePromises)

  console.log('Posts complete 👍')
}

main()
