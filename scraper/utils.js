const fs = require('node:fs')

function getWriter(file) {
  return {
    write: (content) => {
      fs.writeFile(file, content, (err) => {
        if (err) {
          console.error(err)
        } else {
          // file written successfully
        }
      })
    },
  }
}

function getReader(file) {
  return {
    read: () => {
      return fs.promises.readFile(file, 'utf-8')
    },
  }
}

exports.getWriter = getWriter
exports.getReader = getReader
