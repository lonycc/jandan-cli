const commander = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { readDir, stat, spawnSync, exists } = require('../src/utils')

// parse page
commander
  .option('-a, --all', 'show all cache')
  .option('-d, --delete', 'delete all cache')
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
  console.log('operation will delete Cookie!\n')
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

  // check id
;(async() => {
  const all = commander.all || false
  const destroy = commander.delete || false
  if (all) return await showAllCache(true)
  if (destroy) return await deleteAllCache()

  await showAllCache()
})()

