const Table = require('cli-table3')
const ora = require('ora')
const { storage, history } = require('../utils')
const { index, posts } = require('../pages/posts')


module.exports = {
  renderArticles: async(page = 1) => {
    const fetchLog = new ora('fetching...').start()
    const table = new Table({
      head: ['id', 'title', 'comments', 'author'],
      colWidths: [10, 50, 10, 20],
    })

    try {
      const data = await index(page)
      if ( !data || data.status !== 'ok' ) {
        fetchLog.text = ''
        return fetchLog.fail('no content')
      }
      // 解析data.posts
      const articles = []
      data.posts.forEach((item) => {
        articles.push([
          item.id,
          item.title,
          item.comment_count,
          item.author.name + ' . ' + item.tags[0].title,
        ])
      })
      await storage.set('index', articles)
      table.push(...articles)
      fetchLog.clear()
      console.log(String(table))

      history.add('index', `${page}`)
      return fetchLog.succeed(`index, page: ${page}`)
    } catch (e) {
      fetchLog.clear()
      return fetchLog.fail('Err: ' + String(e))
    }
  },

  renderPosts: async(category = 'pic', page = 1) => {
    const fetchLog = new ora('fetching...').start()
    try {
      const data = await posts(category, page)
      if ( !data || data.status !== 'ok' ) {
        fetchLog.text = ''
        return fetchLog.fail('no content')
      }
      storage.set(category, data.comments)
      fetchLog.clear()

      console.log(`${category}, page: ${page}`)
      data.comments.forEach( (item) => {
        console.log(`comment_ID: ${item.comment_ID} comment_post_ID: ${item.comment_post_ID} \n ${item.comment_author} ${item.comment_date} \n ${item.text_content} \n ${item.pics.join('\n')} \n oo[${item.vote_positive}] xx[${item.vote_negative}] 吐槽[${item.sub_comment_count}]\n`);
      })

      history.add(category, `${page}`)
      return fetchLog.succeed(`${category}, page: ${page}`)
    } catch (e) {
      fetchLog.clear()
      return fetchLog.fail('Err: ' + String(e))
    }
  },

}
