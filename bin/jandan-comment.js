const comment = require('../src/pages/comment')
const posts = require('../src/pages/posts')
const commander = require('commander')
const { storage } = require('../src/utils')
const chalk = require('chalk')
const ora = require('ora')
const plog = new ora('post comment...')


// parse search name
commander
  .usage('[-e|a|c|p] <...>')
  .option('-e, --email [email]', 'email', String, 'comment_test@test.dev')
  .option('-a, --author [author]', 'nickname', String, 'comment_test')
  .option('-c, --comment <comment>', 'comment content', String, 'hardcore')
  .option('-p, --comment_post_ID [comment_post_ID]', 'the post id', String)
  .parse(process.argv)

;(async() => {
  plog.start()
  const category = commander.args[0] || 'pic'

  if ( ['pic', 'ooxx', 'treehole', 'qa', 'zoo', 'zhoubian', 'pond'].indexOf(category) < 0 ) return plog.fail(`${category} invalid`)

  const cpid = commander.comment_post_ID ? commander.comment_post_ID : await posts.getPostId(category)

  const data = {
    author: commander.author,
    email: commander.email,
    comment: commander.comment,
    comment_post_ID: cpid,
  }
  const cookie = await storage.getCookie(true)

  const rs = await comment.comment(data, cookie)
  if ( /^\d+$/.test(rs) )
    console.log(chalk.green(`\n发布成功, comment_id=${rs}`))
  else
    console.log(chalk.red(`\n发布失败, ${rs}`))

  plog.stop()
})()
