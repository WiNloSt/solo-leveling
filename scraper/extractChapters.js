const cheerio = require('cheerio')
const { getWriter, getReader } = require('./utils')

async function extractChapters() {
  const reader = getReader('data/chapters.html')
  const chaptersHtml = await reader.read()
  const $ = cheerio.load(chaptersHtml)
  const allLinks = $('.widget-content > ul > li > a')
  const links = Array.from(allLinks)
    .reverse()
    .map((link) => {
      return { name: $(link).text(), link: $(link).attr('href') }
    })

  const writer = getWriter('data/chapters.json')
  writer.write(JSON.stringify(links, null, 2))
}

extractChapters()
