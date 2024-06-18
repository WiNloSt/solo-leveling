const { getReader, getWriter } = require('./utils')

async function scrapeChapters() {
  const chapters = JSON.parse(await getReader('./data/chapters.json').read())
  chapters.forEach(scrapeChapter)
}

/**
 *
 * @param {import('./types').Chapter} chapter
 */
async function scrapeChapter(chapter) {
  const content = await fetch(`${chapter.link}`).then((res) => res.text())
  getWriter(`data/${chapter.name}.html`).write(content)
}

scrapeChapters()
