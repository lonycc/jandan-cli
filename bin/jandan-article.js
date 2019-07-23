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
  .parse(process.argv)
const silence = commander.silence || false

const show = (p) => {
  fetchLog.clear()
  fetchLog.info(`article: ${p.post.id}`)
  console.log(chalk.black.bgWhite.bold(` -${p.post.title}- \n`))
  console.log(`${p.post.content} \n`)
  if (!silence && p.post.comments && p.post.comments.length) {
    console.log('Comments:')
    p.post.comments.forEach((comment, index) => {
      console.log(chalk.bold(`-----------\n[${index}] ${comment.name}: `), `${comment.content}\n`)
    })
  }
  history.add('article', `${p.post.id}||${p.post.title}`)
}
const findArticle = async (id) => {
  checkLog.stop()
  fetchLog.start(`fetching... article.${id}`)
  try {
    const article = await posts.article(id)
    fetchLog.clear()
    if (!article || article.status !== 'ok' ) return fetchLog.fail(`article with id ${id} not found`)
    show(article)
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

// check id
(async() => {
  checkLog.start()
  const id = commander.args[0]
  if ( !id ) return checkLog.fail('id is required')

  const articlesStorage = await storage.get('articles')
  if ( !articlesStorage ) return await findArticle(id)

  const article = articlesStorage.find(article => article[0] === id)
  if ( article && article.id ) return await findArticle(article.id)

  await findArticle(id)
})()
