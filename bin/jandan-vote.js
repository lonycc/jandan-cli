const commander = require('commander')
const comment = require('../src/pages/comment')
const ora = require('ora')
const fetchLog = new ora('voting...')
const { storage } = require('../src/utils')
const chalk = require('chalk')

// parse page
commander
  .option('-o, --oo', 'vote oo to the post')
  .option('-x, --xx', 'vote xx to the post')
  .parse(process.argv)

const oo = commander.oo || false
const xx = commander.xx || false


const voteTucao = async (comment_id, vote_type = 'pos', data_type = 'tucao') => {
  fetchLog.start(`vote ${vote_type} for post ${comment_id} ...\n`)
  try {
    const cookie = await storage.getCookie(true)
    const r = await comment.vote({comment_id, vote_type, data_type}, cookie)
    if ( r.error === 0 ) fetchLog.succeed(r.msg)
    else console.log(chalk.red(r.msg))
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

// check id
;(async() => {
  fetchLog.start('..........');
  const id = commander.args[0]
  if ( !id ) return fetchLog.fail('id is required')

  try {
    if ( oo )
      await voteTucao(id)

    if ( xx )
      await voteTucao(id, 'neg')

  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }

  fetchLog.stop()
})()
