const cheerio = require('cheerio')
const { getWriter, getReader } = require('./utils')
const probe = require('probe-image-size')

async function main() {
  const reader = getReader('data/chapters.json')
  const chapters = JSON.parse(await reader.read())

  for (let chapter of chapters) {
    await extractChapterPages(chapter)
  }
}
/**
 *
 * @param {import('../types').Chapter} chapter
 */
async function extractChapterPages(chapter) {
  const chapterHtml = await getReader(`data/${chapter.name}.html`).read()
  const $ = cheerio.load(chapterHtml)
  const pages = Array.from($('.entry-content img'))

  const extractedPagesPromises = pages.map(async (page) => {
    const src = $(page).attr('src')
    const dataSrc = $(page).attr('data-src')
    return getImageSize(src ?? dataSrc, 3)
  })

  Promise.all(extractedPagesPromises).then((extractedPages) => {
    getWriter(`data/pages/${chapter.name}.json`).write(JSON.stringify(extractedPages, null, 2))
  })
}

async function getImageSize(url, retries = 0) {
  try {
    return await probe(url, { rejectUnauthorized: false })
  } catch (e) {
    if (retries === 0) {
      return {
        url,
        error: 'Cannot get size',
      }
    }

    return getImageSize(url, retries - 1)
  }
}

main()
