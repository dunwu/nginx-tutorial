const chalk = require('chalk');
const ghpages = require('gh-pages');
const paths = require('../config/paths');

const version = require(paths.appPackageJson).version;
console.log(chalk.bold.cyan('Deploy site to gh-pages...'));
console.log(chalk.bold('Current Version：%s'), version);

ghpages.publish('build', {
  dest: 'demos/',
  message: `Deploy demo v${version}`,
  user: {
    name: 'Zhang Peng',
    email: 'forbreak@163.com'
  }
}, (err) => {
  if (err) {
    console.log(chalk.bold.red('Failed to deploy demo v%s.'), version);
    console.log(chalk.bold.red(err));
    throw err;
  }
  console.log(chalk.bold.yellow('Site has been deployed to \n\t https://dunwu.github.io/react-app/demos/'));
});
