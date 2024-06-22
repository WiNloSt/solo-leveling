const cheerio = require('cheerio')
const { getWriter, getReader } = require('./utils')

async function main() {
  const reader = getReader('data/chapters.json')
  const chapters = JSON.parse(await reader.read())
  chapters.forEach(extractChapterPages)
}
/**
 *
 * @param {import('../types').Chapter} chapter
 */
async function extractChapterPages(chapter) {
  const chapterHtml = await getReader(`data/${chapter.name}.html`).read()
  const $ = cheerio.load(chapterHtml)
  const pages = Array.from($('.entry-content img'))

  const extractedPages = pages.map((page) => {
    const src = $(page).attr('src')
    const dataSrc = $(page).attr('data-src')
    return src ?? dataSrc
  })

  getWriter(`data/pages/${chapter.name}.json`).write(JSON.stringify(extractedPages, null, 2))
}

main()
