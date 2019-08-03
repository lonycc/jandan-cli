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
        timeout: 10000,
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
        timeout: 10000,
      })
      return JSON.parse(rs)
    } catch (e) {
      return String(e)
    }
  },

  vote: async(data, cookie = '') => {
    try {
      const rs = await request({
        uri: apis.vote,
        method: 'POST',
        headers: await makeHeader({
          cookie,
          'Referer': apis.host,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }),
        formData: data,
        timeout: 10000,
      })
      return JSON.parse(rs)
    } catch (e) {
      throw e
    }
  },

  report: async(data, cookie = '') => {
    try {
      const rs = await request({
        uri: apis.report,
        method: 'POST',
        headers: await makeHeader({
          cookie,
          'Referer': apis.host,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }),
        formData: data,
        timeout: 10000,
      })
      return JSON.parse(rs)
    } catch (e) {
      throw e
    }
  },

}
