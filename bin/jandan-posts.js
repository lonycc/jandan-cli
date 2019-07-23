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
  const category = commander.args[0] || 'pic'
  const page = 1
  if ( ['pic', 'ooxx'].indexOf(category) < 0 ) return checkLog.fail('category only support pic and ooxx')
  checkLog.stop()
  if ( commander.args.length > 1 ) page = commander.args[1]
  await renderer.renderPosts(category, page || 1)
})()

