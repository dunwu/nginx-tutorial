const path = require('path');
const fs = require('fs');
const url = require('url');

// 确保解决了项目文件夹中的任何符号链接：
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(servedUrl, needsSlash) {
  const hasSlash = servedUrl.endsWith('/');
  if (hasSlash && !needsSlash) {
    return servedUrl.substr(servedUrl, servedUrl.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${servedUrl}/`;
  }
  return servedUrl;
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// 我们使用`PUBLIC_URL` 环境变量或 "homepage" 字段推断应用程序的“公共路径”。
// Webpack 需要知道它可以将正确的<script> hrefs 放入 HTML，
// 即使在单页应用程序中，可能为 /todos/42 这样的嵌套URL提供index.html。
// 我们不在 HTML 中使用相对路径，因为我们不想加载类似 /todos/42/static/js/bundle.7289d.js 这样的文件。
// 我们必须知道根路径。
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appConfig: resolveApp('config'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json'))
};
