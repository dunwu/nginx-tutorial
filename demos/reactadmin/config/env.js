const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// 确保包含 env.js 之后的 paths.js 将会读取 .env 变量。
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,

  // 对于 `test` 环境，不要包含 `.env.local`，因为通常你会希望测试能为每个人产生相同的结果
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean);

// 从 .env* 文件加载环境变量。
// 如果此文件丢失，请使用 silent 抑制警告。
// dotenv 将永远不会修改任何已经设置的环境变量。
// @see https://github.com/motdotla/dotenv
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile
    });
  }
});

// 我们支持根据 `NODE_PATH` 解析模块。
// 这使您可以在导入大型 monorepos 中使用绝对路径：
// https://github.com/facebookincubator/create-react-app/issues/253。
// 它的工作类似于 Node 本身的 `NODE_PATH`：
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// 请注意，与 Node 不同，只有来自 `NODE_PATH` 的相对路径才能得到认可。
// 否则，我们有可能将 Node.js 的核心模块导入到应用程序而不是 Webpack 垫片。
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// 我们也解决了这些问题，确保使用它们的所有工具始终如一地工作
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// 抓取 NODE_ENV 和 REACT_APP_* 环境变量，
// 并通过 Webpack 配置中的 DefinePlugin 将它们预先注入到应用程序中。
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // 用于确定我们是否以生产模式运行。
        // 最重要的是，它将 React 切换到正确的模式。
        NODE_ENV: process.env.NODE_ENV || 'development',

        // 用于解决 `public` 中静态资源的正确路径。
        // 例如，<img src={process.env.PUBLIC_URL + '/img/logo.png'} />。
        // 这只能用作逃生舱口。通常情况下，您可以在代码中将图像放入 `src` 和 `import` ，以获取路径。
        PUBLIC_URL: publicUrl
      }
    );
  // 对所有值进行排序，以便我们可以进入 Webpack DefinePlugin。
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
