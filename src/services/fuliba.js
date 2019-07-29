const { request, apis } = require('../utils')
const cheerio = require('cheerio')

module.exports = {
  fuli: async(id = '2019001', nfsw = false) => {
    try {
      const data = await request({
        uri: nfsw ? `${apis.fuliba}/${id}.html/2` : `${apis.fuliba}/${id}.html`,
        method: 'GET',
        timeout: 10000,
        headers: {
          'Host': 'fulibus.net',
          'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
        },
      })
      const $ = cheerio.load(data)
      const pics = []
      $('article.article-content').find('img').each( (i, ele) => {
        pics.push($(ele).attr('src'))
      })
      return pics
    } catch (e) {
      throw e
    }
  },

}
