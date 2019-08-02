const { exists, spawnSync, writeFile, readFile, mkdir } = require('./base')
const init = async() => {
  if ( !await exists('./jandan_cache') ) {
    await mkdir('./jandan_cache/')
  }
}

const storage = {
  set: async(key, value) => {
    await init()
    const path = `./jandan_cache/${key}.json`
    if (await exists(path)) spawnSync('rm', [path])
    await writeFile(path, JSON.stringify(value), 'utf-8')
  },

  get: async(key) => {
    const path = `./jandan_cache/${key}.json`
    if (!await exists(path)) return null
    let result = {}
    try {
      result = JSON.parse(await readFile(path, 'utf-8'))
    } catch (e) {
      result = {}
    }
    return result
  },

  write: async(name, content, encoding = 'utf-8') => {
    await init()
    const path = `./jandan_cache/${name}`
    if (await exists(path)) spawnSync('rm', [path])
    await writeFile(path, content, encoding)
    return path
  },

  read: async(name) => {
    const path = `./jandan_cache/${name}`
    if ( !await exists(path) ) return null
    return await readFile(path, 'utf-8')
  },

  exists: async(name) => {
    const path = `./jandan_cache/${name}`
    return await exists(path)
  },

  remove: async(name) => {
    const path = `./jandan_cache/${name}.json`
    if ( await exists(path) ) {
      spawnSync('rm', [path])
      return true
    }
    return false
  },
}

const history = {
  get: async(key = 'post', type = 'history') => {
    const record = await storage.get(type)
    if ( !record || !record[key] ) return null
    return record[key]
  },

  del: async(key, type = 'history') => {
    const record = await storage.get(type) || {}
    if ( !record || !record[key] ) return false
    delete record[key]
    await storage.set(type, record)
  },

  add: async(key, value, type = 'history') => {
    const record = await storage.get(type) || {}
    const next = Object.assign({}, record, { [String(key)]: value })
    await storage.set(type, next)
  },
}

const getCookie = async(silent = false) => {
  const cookie = await storage.read('cookie')
  if (!cookie && !silent) {
    throw 'cookie not found, try run [jandan cookie] set it.'
  }
  return cookie || ''
}

module.exports = {
  storage: Object.assign(storage, { getCookie }),
  history,
}
