// 首要的事是让任何代码都知道正确的运行环境。
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// 脚本遇到未处理的 rejections 将直接崩溃，而不是默默的忽略它们。
// 将来，未处理的 promise rejections 将以非零退出代码终止 Node.js 进程。
process.on('unhandledRejection', err => {
  throw err;
});

// 确保环境变量可以被读取。
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// 如果必要的文件丢失，将告警和崩溃
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// 类似 Cloud9 这样的工具依赖于此
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// 我们尝试使用默认端口，但如果端口已被占用，则通常会为用户分配一个不同的端口。
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // 未发现端口
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // 创建一个按照自定义消息配置的 webpack 编译器。
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // 加载代理配置
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // 通过 web 服务器提供由编译器生成的 webpack 资源。
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // 启动 WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      openBrowser(urls.localUrlForBrowser);
      return console.log(chalk.cyan('Starting the development server...\n'));
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
