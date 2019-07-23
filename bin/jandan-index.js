const commander = require('commander')
const renderer = require('../src/services/renderer')

// parse page
commander
  .parse(process.argv)

// check id
;(async() => {
  const page = commander.args[0] || 1
  await renderer.renderArticles(page)
})()

