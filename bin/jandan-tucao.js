const comment = require('../src/pages/comment')
const commander = require('commander')
const { storage } = require('../src/utils')
const chalk = require('chalk')
const ora = require('ora')
const plog = new ora('post comment...')


// parse search name
commander
  .usage('[-e|a|c|m] <...>')
  .option('-e, --email [email]', 'email', String, 'tucao_test@test.dev')
  .option('-a, --author [author]', 'nickname', String, 'tucao_test')
  .option('-c, --content <content>', 'tucao content', String, 'hardcore')
  .option('-m, --comment_id [comment_id]', 'the comment id', String, '412345')
  //.option('-p, --comment_post_ID [comment_post_ID]', 'the post id', String, '10086')
  .parse(process.argv)

;(async() => {
  plog.start()
  const data = {
    author: commander.author,
    email: commander.email,
    content: commander.content,
    comment_id: commander.comment_id,
    //comment_post_ID: commander.comment_post_ID,
  }
  const cookie = await storage.getCookie(true)

  const rs = await comment.tucao(data, cookie)
  if ( rs && rs.code === 0 )
    console.log(chalk.green(`\n吐槽成功, comment_id=${rs.data.comment_ID}`))
  else
    console.log(chalk.red(`\n吐槽失败, ${rs.msg}`))

  plog.stop()
})()
