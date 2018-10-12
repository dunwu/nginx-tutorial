// 首要的事是让任何代码都知道正确的运行环境。
process.env.BABEL_ENV = 'real';
process.env.NODE_ENV = 'real';

// 脚本遇到未处理的 rejections 将直接崩溃，而不是默默的忽略它们。
// 将来，未处理的 promise rejections 将以非零退出代码终止 Node.js 进程。
process.on('unhandledRejection', err => {
  throw err;
});

// 确保环境变量可以被读取。
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// 这些尺寸相当大。我们会警告超过限制的 bundle。
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// 如果必要的文件丢失，将告警和崩溃
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// 创建生产环境构建并打印部署说明。
function build(previousFileSizes) {
  console.log('Creating an optimized real build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // 只保留第一个错误。其他错误通常指示着同样的问题，使读者感到混乱。
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
        process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
            'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings
      });
    });
  });
}

// 拷贝 public 文件夹内容到 build 文件夹
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}

// 首先，在构建目录中读取当前的文件大小。
// 这让我们可以显示以后改变了多少。
measureFileSizesBeforeBuild(paths.appBuild)
  .then(previousFileSizes => {
    // 删除 build 文件夹所有内容，但保留目录
    fs.emptyDirSync(paths.appBuild);
    // 拷贝 public 文件夹内容到 build 文件夹
    copyPublicFolder();
    // 开始 webpack 构建
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${
            chalk.underline(chalk.yellow('keywords'))
          } to learn more about each warning.`
        );
        console.log(
          `To ignore, add ${
            chalk.cyan('// eslint-disable-next-line')
          } to the line before.\n`
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  );

