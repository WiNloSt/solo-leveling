const cheerio = require('cheerio')
const { getWriter, getReader } = require('./utils')

async function main() {
  const reader = getReader('data/chapters.json')
  const chapters = JSON.parse(await reader.read())
  chapters.forEach(extractChapterPages)

  // const $ = cheerio.load(chaptersHtml)
  // const allLinks = $('.widget-content > ul > li > a')
  // const links = Array.from(allLinks)
  //   .reverse()
  //   .map((link) => {
  //     return { name: $(link).text(), link: $(link).attr('href') }
  //   })

  // const writer = getWriter('data/chapters.json')
  // writer.write(JSON.stringify(links, null, 2))
}
/**
 *
 * @param {import('./types').Chapter} chapter
 */
async function extractChapterPages(chapter) {
  const chapterHtml = await getReader(`data/${chapter.name}.html`).read()
  const $ = cheerio.load(chapterHtml)
  const pages = Array.from($('.entry-content img'))

  const extractedPages = pages.map((page) => {
    return $(page).attr('src')
  })

  getWriter(`data/pages/${chapter.name}.json`).write(JSON.stringify(extractedPages, null, 2))
}

main()
