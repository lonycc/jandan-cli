const comment = require('../src/pages/comment')
const commander = require('commander')
const { storage } = require('../src/utils')
const chalk = require('chalk')
const ora = require('ora')
const plog = new ora('post comment...')


// parse search name
commander
  .usage('[-e|a|c|m] <...>')
  .option('-e, --email [email]', 'email, set it once', String)
  .option('-a, --author [author]', 'nickname, set it once', String)
  .option('-c, --content <content>', 'tucao content', String)
  .option('-m, --comment_id [comment_id]', 'the comment id', parseInt)
  .parse(process.argv)

;(async() => {
  plog.start()
  if ( !commander.content )
    return plog.fail('content must be set')

  if ( !commander.comment_id )
    return plog.fail('comment_id must be set')

  const user = await storage.get('user') || {}
  if ( commander.email )
    user.email = commander.email
  if ( commander.author )
    user.author = commander.author

  await storage.set('user', user)
  if ( !user.hasOwnProperty('author') )
    return plog.fail('author must be set')

  if ( !user.hasOwnProperty('email') )
    return plog.fail('email must be set')

  const data = {
    author: user.author,
    email: user.email,
    content: commander.content,
    comment_id: commander.comment_id,
  }
  const cookie = await storage.getCookie(true)

  const rs = await comment.tucao(data, cookie)
  if ( rs && rs.code === 0 )
    console.log(chalk.green(`\n吐槽成功, comment_id=${rs.data.comment_ID}`))
  else
    console.log(chalk.red(`\n吐槽失败, ${rs.msg}`))

  plog.stop()
})()
