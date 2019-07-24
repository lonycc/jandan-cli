const fs = require('fs')
const promisify = require('util.promisify')
const childProcess = require('child_process')
const request = require('request-promise-native')
const api = 'http://i.jandan.net/?oxwlxojflwblxbsapi='
const host = 'http://i.jandan.net'
const moyu = 'http://api.moyu.today'

const makeHeader = async(headers = {}) => {
  return Object.assign({}, {
    'Content-Type': 'application/json',
    'User-Agent': 'Jandan Android App V5.1.0.2',
  }, headers)
}

const noErrorPromisifyShim = func => (...args) => new Promise(r => {
  func(...args, (...results) => r(...results))
})

const makePromisify = () => {
  const nativePromisify = require('util').promisify
  if (nativePromisify && typeof nativePromisify === 'function') {
    return nativePromisify
  }
  return noErrorPromisifyShim
}
const noErrorPromisify = makePromisify()

const apis = {
  index: `${api}/get_recent_posts&page=`,
  article: `${api}/get_post&id=`,
  posts: `${api}`,
  comments: `${host}/tucao/`,
  hot: `${moyu}/jandan/hot?category=`,
  tucao: 'http://i.jandan.net/jandan-tucao.php',
  comment: 'http://i.jandan.net/jandan-comment.php',
  host: host,
}

const utils = {
  readDir: promisify(fs.readdir),
  mkdir: promisify(fs.mkdir),
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  exists: noErrorPromisify(fs.exists),
  stat: promisify(fs.stat),
  spawnSync: childProcess.spawnSync,
}

const checkAuthorization = (body) => {
  return !String(body).includes('<a href="/signin" class="top">登录</a>')
}

module.exports = Object.assign({
  apis,
  makeHeader,
  checkAuthorization,
  request,
}, utils)

