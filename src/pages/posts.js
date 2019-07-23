const cheerio = require('cheerio')
const { request, apis, makeHeader } = require('../utils')

module.exports = {
  getPostId: async(category) => {
    try {
      const rs = await request({
        uri: `${apis.host}/${category}`,
        method: 'GET',
        headers: await makeHeader({
          'Referer': apis.host,
        }),
      })
      const $ = await cheerio.load(rs)
      return $('input#comment_post_ID').attr('value')
    } catch (e) {
      throw e
    }
  },

  index: async(page = 1) => {
    try {
      const data = await request({
        uri: `${apis.index}${page}`,
        method: 'GET',
        headers: await makeHeader(),
      })

      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

  article: async(id = 95834 ) => {
    try {
      const data = await request({
        uri: `${apis.article}${id}`,
        method: 'GET',
        headers: await makeHeader(),
      })
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

  posts: async(category = 'pic', page = 1) => {
    try {

      const uri = ( ['pic', 'ooxx'].indexOf(category) > -1 ) ? `${apis.posts}jandan.get_${category}_comments&page=${page}` : `${apis.hot}${category}`

      const data = await request({
        uri: uri,
        method: 'GET',
        headers: await makeHeader(),
      })
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

  comments: async(id = 10086) => {
    try {
      const data = await request({
        uri: `${apis.comments}/${id}`,
        method: 'GET',
        headers: await makeHeader(),
      })
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

}
