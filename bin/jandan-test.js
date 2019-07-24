const commander = require('commander')
const renderer = require('../src/services/renderer')
const ora = require('ora')
const fetchLog = new ora('fetching...')

// parse page
commander
  .option('-d, --download', 'download pics in the post')
  .parse(process.argv)

const download = commander.download || false
const hot = false
const other = true

// check id
;(async() => {
  fetchLog.start();
  const category = commander.args[0] || 'treehole'
  if ( ['qa', 'zhoubian', 'treehole', 'pond'].indexOf(category) < 0 ) return fetchLog.fail('category only support qa/zhoubian/treehole/pond')
  const page = commander.args[1] || 0
  fetchLog.stop()
  await renderer.renderPosts(category, page, hot, download, other)
})()
