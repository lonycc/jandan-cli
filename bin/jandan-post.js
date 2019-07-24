const posts = require('../src/pages/posts')
const commander = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const { storage, history } = require('../src/utils')
const checkLog = new ora('check params...')
const fetchLog = new ora()
// parse id
commander
  .option('-s, --silence', 'silence mode, hidden all comments')
  .option('-h, --hot', 'hot post, find the post in hot list')
  .parse(process.argv)
const silence = commander.silence || false
const hot = commander.hot || false

const show = (p, c) => {
  fetchLog.clear()
  fetchLog.info(`comment_id: ${p.comment_ID}, comment_post_ID: ${p.comment_post_ID}`)
  console.log(chalk.black.bgWhite.bold(` ${p.text_content} \n ${p.pics.join('\n')} `))
  if ( !silence && c.tucao && c.tucao.length ) {
    if ( c.hot_tucao.length ) {
      console.log('hot comments:')
      c.hot_tucao.forEach((comment, index) => {
        console.log(chalk.bold(`-----------\n[${index}] ${comment.comment_author}: `), `${comment.comment_content}\n`)
      })
    }
    console.log('sorted comments:')
    c.tucao.forEach((comment, index) => {
      console.log(chalk.bold(`-----------\n[${index}] ${comment.comment_author}: `), `${comment.comment_content}\n`)
    })
  }
  history.add('post', p.comment_ID)
}

const findPost = async (post) => {
  checkLog.stop()
  fetchLog.start(`fetching...post.${post.comment_ID}\n`)
  try {
    const comments = await posts.comments(post.comment_ID)
    fetchLog.clear()
    if (!comments || comments.code !== 0 ) return fetchLog.fail(`post with id ${post.comment_ID} not found`)

    show(post, comments)
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

// check category and id
;(async() => {
  checkLog.start()
  const category = commander.args[0]
  const id = commander.args[1]

  if ( !id ) return checkLog.fail('id is required')

  if ( ['pic', 'ooxx', 'picture', 'week', 'recent', 'joke', 'comment', 'qa', 'zhoubian', 'treehole', 'pond'].indexOf(category) < 0 ) return checkLog.fail('category invalid')

  const postsStorage = hot ? await storage.get(`hot_${category}`) : await storage.get(category)
  if ( !postsStorage ) return checkLog.fail(`make sure you have run [jandan posts ${category}] before`)

  const post = postsStorage.find(post => post.comment_ID === id)

  if ( post ) return await findPost(post)

  return checkLog.fail('post not found')
})()
