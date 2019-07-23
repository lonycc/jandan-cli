const commander = require('commander')
const renderer = require('../src/services/renderer')
const ora = require('ora')
const checkLog = new ora('check params...')

// parse page
commander
  .parse(process.argv)

// check id
;(async() => {
  checkLog.start();
  const category = commander.args[0] || 'picture'
  if ( ['recent', 'week', 'picture', 'comment', 'joke'].indexOf(category) < 0 ) return checkLog.fail('category only support recent/week/picture/comment/joke')
  checkLog.stop()
  await renderer.renderPosts(category, 1)
})()
