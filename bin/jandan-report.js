const comment = require('../src/pages/comment')
const commander = require('commander')
const { storage } = require('../src/utils')
const chalk = require('chalk')
const ora = require('ora')
const plog = new ora('post report...')


// parse search name
commander
  .usage('[-a|r|t|c] <...>')
  .option('-t, --type [type]', 'type, comment', parseInt, 1)
  .option('-a, --action [action]', 'which action, support report only now', String, 'report')
  .option('-r, --reason <reason>', 'report reason', String)
  .option('-c, --comment_id [comment_id]', 'the comment id', parseInt)
  .parse(process.argv)

;(async() => {
  plog.start()

  if ( !commander.reason )
    return plog.fail('reson must be set')

  if ( !Number.isInteger(commander.comment_id) )
    return plog.fail('comment_id must be integer')

  const data = {
    action: commander.action || 'report',
    reason: commander.reason,
    comment_id: commander.comment_id,
  }

  if ( commander.type === 1 )
    data.type = 1

  const cookie = await storage.getCookie(true)

  const rs = await comment.report(data, cookie)
  if ( rs && rs.code === 0 )
    console.log(chalk.green('\n举报成功'))
  else
    console.log(chalk.red(`\n举报失败, ${rs.msg}`))

  plog.stop()
})()
