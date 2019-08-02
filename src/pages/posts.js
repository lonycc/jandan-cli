const cheerio = require('cheerio')
const { request, apis, makeHeader, storage } = require('../utils')

module.exports = {
  getPostId: async(category = 'treehole') => {
    try {
      const rs = await request({
        uri: `${apis.host}/${category}`,
        method: 'GET',
        headers: await makeHeader({
          'Referer': apis.host,
        }),
        timeout: 10000,
      })
      const $ = await cheerio.load(rs)
      return $('input#comment_post_ID').attr('value')
    } catch (e) {
      throw e
    }
  },

  downloadImage: async(url) => {
    try {
      const name = url.split('/').slice(-1)[0]
      if ( await storage.exists(name) ) return `${name} exists `
      const img = await request({
        uri: url,
        method: 'GET',
        encoding: 'binary',
        headers: await makeHeader({
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        }),
        timeout: 10000,
      })
      return await storage.write(name, Buffer.from(img, 'binary'), 'binary')
    } catch (e) {
      throw e
    }
  },

  getList: async(category = 'treehole', page = 0) => {
    try {
      const uri = page === 0 ? `${apis.host}/${category}` : `${apis.host}/${category}/page-${page}#comments`
      const rs = await request({
        uri,
        method: 'GET',
        headers: await makeHeader({
          'Referer': apis.host,
        }),
        timeout: 10000,
      })
      const posts = []
      const $ = await cheerio.load(rs)
      //return rs
      $('ol.commentlist li[id]').each( (i, ele) => {
        const content = $(ele).find('div.commenttext')
        const time = $(ele).find('span.time').text().replace('@ ', '')
        const pics = []
        content.find('a.view_img_link').each( (j, img) => {
          pics.push($(img).attr('href').indexOf('http') === 0 ? $(img).attr('href') : 'http:' + $(img).attr('href'))
        })
        posts.push({
          comment_ID: $(ele).find('span.righttext a').text(),
          comment_author: $(ele).find('b').text(),
          comment_date: time,
          comment_date_gmt: time,
          comment_content: content.html(),
          user_id: 0,
          vote_positive: $(ele).find('a[data-type="pos"]').next().text(),
          vote_negative: $(ele).find('a[data-type="neg"]').next().text(),
          sub_comment_count: $(ele).find('a.tucao-btn').text().match(/\d+/g)[0],
          text_content: content.text(),
          pics: pics,
        })
      });
      return { comments: posts, status: 'ok' }
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
        timeout: 10000,
      })

      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

  article: async(id = 95834 ) => {
    try {
      const rs = await request({
        uri: `${apis.article}${id}`,
        method: 'GET',
        headers: await makeHeader(),
        timeout: 10000,
      })
      return JSON.parse(rs)
    } catch (e) {
      throw e
    }
  },

  posts: async(category = 'pic', page = 1, hot = false) => {
    try {
      const uri = hot ? `${apis.hot}${category}` : `${apis.posts}jandan.get_${category}_comments&page=${page}`

      const data = await request({
        uri: uri,
        method: 'GET',
        headers: await makeHeader(),
        timeout: 10000,
      })
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

  post: async(comment_id = 10086) => {
    try {
      const rs = await request({
        uri: `${apis.post}/${comment_id}`,
        method: 'GET',
        headers: await makeHeader(),
        timeout: 10000,
      })
      const $ = await cheerio.load(rs)
      const content = $('div.entry')
      const pics = []
      content.find('a.view_img_link').each( (j, img) => {
        pics.push($(img).attr('href').indexOf('http') === 0 ? $(img).attr('href') : 'http:' + $(img).attr('href'))
      })
      return {
        comment_ID: comment_id,
        comment_author: content.find('b').text(),
        comment_date: 'unknow',
        comment_date_gmt: 'unknow',
        comment_content: content.find('p').html(),
        user_id: 0,
        vote_positive: 0,
        vote_negative: 0,
        sub_comment_count: 0,
        text_content: content.find('p').text(),
        pics: pics,
      }
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
        timeout: 10000,
      })
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  },

}
