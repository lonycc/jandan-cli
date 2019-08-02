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
  .option('-f, --favour', 'add the article to your favourite')
  .parse(process.argv)
const silence = commander.silence || false
const favour = commander.favour || false


const favourArticle = async (article, type = 'article') => {
  fetchLog.start(`favour article ${article.post.id} ...\n`)
  try {
    await history.add(`${type}_${article.post.id}`, article.post.title, 'favour')
    fetchLog.succeed('success')
  } catch (e) {
    fetchLog.fail(`err: ${String(e)}`)
  }
}

const show = async (p) => {
  //fetchLog.clear()
  fetchLog.info(`article id: ${p.post.id}, date: ${p.post.date}`)
  fetchLog.info(`url: ${p.post.url}`)
  fetchLog.info(`author: ${p.post.author.name}, category: ${p.post.categories[0].description}\n`)
  console.log(chalk.black.bgWhite.bold(` -${p.post.title}- \n`))
  console.log(chalk.green(p.post.excerpt) + '\n')
  console.log(`${p.post.content} \n`)
  if (!silence && p.post.comments && p.post.comments.length) {
    console.log('Comments:')
    p.post.comments.forEach((comment, index) => {
      console.log(chalk.bold(`-----------\n[${index}] ${comment.name}: `), `${comment.content}\n [comment_ID] ${comment.id} [oo] ${comment.vote_positive} [xx] ${comment.vote_negative}\n`)
    })
  }
  history.add('article', `${p.post.id}||${p.post.title}`)
}

const findArticle = async (id) => {
  checkLog.stop()
  fetchLog.start(`fetching... article.${id}`)
  try {
    const article = await posts.article(id)
    //fetchLog.clear()
    if ( !article || article.status !== 'ok' ) return fetchLog.fail(`article with id ${id} not found`)

    if ( favour )
      await favourArticle(article)
    await show(article)
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
