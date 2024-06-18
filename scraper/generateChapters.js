const { getWriter } = require('./utils')

async function getChapters() {
  const html = await getHtml('https://sololevel.online/')
  const writer = getWriter('data/chapters.html')
  writer.write(html)
}

async function getHtml(url) {
  return fetch(url).then((response) => {
    return response.text()
  })
}

getChapters()
