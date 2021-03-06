const commander = require('commander')
const chalk = require('chalk')
const { version } = require('../package.json')
const v = process.version.match(/\d+/g)[0]
if (v < 10) {
  console.log(chalk.yellow('require node.js 10.0+ version'))
  console.log(chalk.yellow('you need upgrade node.js\n'))
  console.log('progress over stability ———— DHH')
  process.exit(1)
}

commander
  .version(version)
  .usage('<command> [options]')
  .command('index [page]', 'display jandan index page')
  .command('article [id]', 'view article detail')
  .command('posts [category] [page]', 'view post list')
  .command('test [category] [page]', 'view other list not in api mode')
  .command('post [id] [category]', 'view post detail')
  .command('cache', 'show cache')
  .command('cookie', 'add browser cookie')
  .command('remove', 'uninstall jandan-cli')
  .command('comment [category]', 'post comment')
  .command('tucao', 'post tucao')
  .command('vote [id]', 'vote for tucao')
  .command('report', 'report tucao or comment')
  .command('fuli [id]', 'fetch imgs from fuliba')
  .parse(process.argv)


