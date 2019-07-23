const commander = require('commander')
const inquirer = require('inquirer')
const Table = require('cli-table3')
const chalk = require('chalk')
const ora = require('ora')
const { storage } = require('../src/utils')
const { check } = require('../src/services/version')
const saveLog = new ora('check version...')

// parse page
commander.parse(process.argv)
const table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }})
table.push(
  [`                ${chalk.green.bold('HELLO, jandaner.')}                `],
)
console.log(String(table), '\n')
new ora()
  .info('Before using, you may set cookie...')
  .stop()

const promps = [{
  type: 'input',
  name: 'cookie',
  message: 'cookie:',
  validate: input => !!input,
}]

// check id
;(async() => {
  // check version
  saveLog.start()
  await check(saveLog)
  // run inquirer
  const asnwers = await inquirer.prompt(promps)
  const cookie = asnwers.cookie
  if ( !cookie.includes('_ga') ) {
    console.log(chalk.red('invalid cookie'))
    return process.exit(1)
  }

  saveLog.text = 'save cookie...'
  saveLog.start()
  await storage.write('cookie', cookie)
  saveLog.succeed('cookie saved')
  process.exit(1)
})()


