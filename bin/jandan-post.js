const posts = require('../src/pages/posts')
const comments = require('../src/pages/comment')
const commander = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const { storage, history } = require('../src/utils')
const checkLog = new ora('check params...')
const fetchLog = new ora()
// parse id
commander
  .option('-s, --silence', 'silence mode, hidden all comments')
  .option('-t, --top', 'top post, find the post in top list')
  .option('-o, --oo', 'vote oo to the post')
  .option('-x, --xx', 'vote xx to the post')
  .option('-f, --favour', 'add the post to your favourite')
  .parse(process.argv)
const silence = commander.silence || false
const hot = commander.top || false
const oo = commander.oo || false
const xx = commander.xx || false
const favour = commander.favour || false

const show = async (p, c) => {
  //fetchLog.clear()
  fetchLog.info(`comment_id: ${p.comment_ID}, comment_post_ID: ${p.comment_post_ID}`)
  console.log(chalk.black.bgWhite.bold(` ${p.text_content} \n ${p.pics.join('\n')} `))
  if ( !silence && c.tucao && c.tucao.length ) {
    if ( c.hot_tucao.length ) {
      console.log('hot comments:')
      c.hot_tucao.forEach((comment, index) => {
        console.log(chalk.bold(`-----------\n[${index}] ${comment.comment_author}: `), `${comment.comment_content}\n [tucao_id] ${comment.comment_ID}\n`)
      })
    }
    console.log('sorted comments:')
    c.tucao.forEach((comment, index) => {
      console.log(chalk.bold(`-----------\n[${index}] ${comment.comment_author}: `), `${comment.comment_content}\n [tucao_id] ${comment.comment_ID}\n`)
    })
  }
  history.add('post', p.comment_ID)
}

const votePost = async (comment_id, vote_type = 'pos', data_type = 'comment') => {
  fetchLog.start(`vote ${vote_type} for post ${comment_id} ...\n`)
  try {
    const cookie = await storage.getCookie(true)
    const r = await comments.vote({comment_id, vote_type, data_type}, cookie)
    if ( r.error === 0 ) fetchLog.succeed(r.msg)
    else console.log(chalk.red(r.msg))
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

const favourPost = async (post, type = 'comment') => {
  fetchLog.start(`favour post ${post.comment_ID} ...\n`)
  try {
    await history.add(`${type}_${post.comment_ID}`, post.text_content, 'favour')
    fetchLog.succeed('success')
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

const findPost = async (post) => {
  checkLog.stop()
  fetchLog.start(`fetching...post.${post.comment_ID}\n`)
  try {
    const comments = await posts.comments(post.comment_ID)
    //fetchLog.clear()
    if (!comments || comments.code !== 0 ) return fetchLog.fail(`post with id ${post.comment_ID} not found`)

    if ( oo )
      await votePost(post.comment_ID)
    if ( xx )
      await votePost(post.comment_ID, 'neg')
    if ( favour )
      await favourPost(post)
    await show(post, comments)
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

// check category and id
;(async() => {
  checkLog.start()
  const category = commander.args[1] || false
  const id = commander.args[0]

  if ( !id ) return checkLog.fail('id is required')

  if ( category && ['pic', 'ooxx', 'picture', 'week', 'recent', 'joke', 'comment', 'qa', 'zhoubian', 'treehole', 'pond'].indexOf(category) < 0 ) return checkLog.fail('category invalid')

  const postsStorage = hot ? await storage.get(`hot_${category}`) : await storage.get(category)

  const p = postsStorage ? postStorage.find(post => post.comment_ID === id) : false
  const post = ( p ) ? p : await posts.post(id)
  if ( post ) return await findPost(post)

  return checkLog.fail('post not found')
})()
