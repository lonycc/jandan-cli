const commander = require('commander')
const fuliba = require('../src/services/fuliba')
const ora = require('ora')
const fetchLog = new ora('fetching...\n')
const { history, storage } = require('../src/utils/storage')

// parse page
commander
  .option('-n, --nsfw', 'next page for nsfw pics')
  .parse(process.argv)

const nfsw = commander.nsfw || false

;(async() => {
  fetchLog.start();
  const id = commander.args[0] || '2019001'
  const key = nfsw ? `${id}_2` : id
  const data = await storage.get(key)
  const fuli = data ? data : await fuliba.fuli(id, nfsw)
  storage.set(key, fuli)
  history.add('fuli', key)
  console.log(fuli)

  fetchLog.clear()
  fetchLog.succeed(`福利汇总: ${key}期`)
})()
