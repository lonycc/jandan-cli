const commander = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { readDir, stat, spawnSync, exists } = require('../src/utils')
const { history, storage } = require('../src/utils/storage')

// parse page
commander
  .option('-a, --all', 'show all cache')
  .option('-d, --delete', 'delete all cache')
  .option('-f, --favour', 'show your favour list')
  .option('-r, --remove', 'remove all your favour list')
  .option('-k, --favour_id [favour_id]', 'favour id', String)
  .parse(process.argv)

const showAllCache = async(all = false) => {
  if (!await exists('./jandan_cache/')) return console.log(chalk.green('no cache'))
  const dir = await readDir('./jandan_cache/')
  if (!dir || !dir.length) return console.log(chalk.green('no cache'))
  const { size } = await stat('./jandan_cache/')

  if (!all) {
    console.log(chalk.green(`cache_size: ${size}k`))
    return console.log(chalk.yellow('run [jandan cache -a] view all'))
  }
  const files = dir.reduce((pre, next) => {
    const show = next.includes('.') ? next.split('.')[0] : next
    return pre ? `${pre}, ${show}` : show
  }, '')
  console.log(chalk.green(`${files} \ntotal_size: ${size}k`))
  console.log(chalk.yellow('run [jandan cache -d] delete all cache'))
}

const deleteAllCache = async() => {
  console.log('this will delete all cache, include your favour list\n')
  const promps = [{
    type: 'input',
    name: 'continue',
    message: 'continue: Y / N(default)',
    validate: input => !!input,
  }]
  const asnwers = await inquirer.prompt(promps)
  const toggle = String(asnwers.continue).toLowerCase() === 'y'
  if (!toggle) return console.log(chalk.yellow('cancelled'))
  spawnSync('rm', ['-r', './jandan_cache/'])
  console.log(chalk.green('cache removed'))
}

const showMyFavour = async() => {
  console.log('your favour list below: \n')
  const data = await storage.get('favour')
  if ( !data ) return console.log(chalk.red('no favour list'))

  Object.keys(data).map( (item) => {
    console.log(chalk.bold(`[${item}]`), chalk.green(data[item]))
  })
}

const removeMyFavour = async(key = false) => {
  console.log('this will remove your favour list:\n')
  const promps = [{
    type: 'input',
    name: 'continue',
    message: 'continue: Y / N(default)',
    validate: input => !!input,
  }]
  const asnwers = await inquirer.prompt(promps)
  const toggle = String(asnwers.continue).toLowerCase() === 'y'
  if ( !toggle ) return console.log(chalk.yellow('cancelled'))
  if ( key !== false ) {
    if ( await history.del(`article_${key}`, 'favour') )
      console.log(chalk.green(`favour article id ${key} removed`))
    else if ( await history.del(`comment_${key}`, 'favour') )
      console.log(chalk.green(`favour comment id ${key} removed`))
    else
      console.log(chalk.red(`${key} not in the favour list`))
  } else {
    await storage.remove('favour')
    console.log(chalk.green('favour list removed'))
  }
}

  // check id
;(async() => {
  const all = commander.all || false
  const destroy = commander.delete || false
  const favour = commander.favour || false
  const drop_favour = commander.remove || false
  const favour_id = commander.favour_id || false
  if ( all ) return await showAllCache(true)
  if ( destroy ) return await deleteAllCache()
  if ( favour ) return await showMyFavour()
  if ( drop_favour ) return await removeMyFavour(favour_id)

  await showAllCache()
})()

