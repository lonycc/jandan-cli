const commander = require('commander')
const renderer = require('../src/services/renderer')
const ora = require('ora')
const checkLog = new ora('check params...')

// parse
commander
  .option('-t, --top', 'get top list')
  .option('-d, --download', 'download pics in the post')
  .parse(process.argv)

const hot = commander.top || false
const download = commander.download || false

// check id
;(async() => {
  checkLog.start();
  const category = commander.args[0] || 'pic'
  const page = commander.args[1] || 1

  if ( ['pic', 'ooxx', 'picture', 'week', 'recent', 'joke', 'comment'].indexOf(category) < 0 ) return checkLog.fail('category can be pic/ooxx/picture/week/rencent/joke/comment')
  checkLog.stop()

  await renderer.renderPosts(category, page, hot, download)
})()

