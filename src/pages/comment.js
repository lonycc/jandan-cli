const { request, apis, makeHeader } = require('../utils')

module.exports = {
  comment: async(data, cookie = '') => {
    try {
      const rs = await request({
        uri: apis.comment,
        method: 'POST',
        resolveWithFullResponse: false,
        headers: await makeHeader({
          cookie,
          'Referer': apis.host,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }),
        formData: data,
      })
      return rs
    } catch (e) {
      return String(e)
    }
  },

  tucao: async(data, cookie = '') => {
    try {
      const rs = await request({
        uri: apis.tucao,
        method: 'POST',
        resolveWithFullResponse: false,
        headers: await makeHeader({
          cookie,
          'Referer': apis.host,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }),
        formData: data,
      })
      return JSON.parse(rs)
    } catch (e) {
      return String(e)
    }
  },

}
