/**
 * @file webpack 开发服务器配置
 * @see https://doc.webpack-china.org/configuration/dev-server
 */
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function (proxy, allowedHost) {
  return {

    // WebpackDevServer 2.4.3引入了一个安全修复程序，可防止远程站点通过DNS重新绑定访问本地内容：
    // @see https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // 但是，云端环境或子域名开发中的几个现有用例显着更复杂：
    // https://github.com/facebookincubator/create-react-app/issues/2271
    // https://github.com/facebookincubator/create-react-app/issues/2233
    // 我们正考虑更好的解决方案，现在我们将暂时妥协。
    // 由于我们的 WDS 配置只提供 `public` 文件夹中的文件，所以我们不会考虑访问一个漏洞。
    // 但是，如果您使用 `proxy` 功能，它会变得更危险，因为它可能暴露在 Django 和 Rails 等后端的远程代码执行漏洞。
    // 所以我们将正常禁用主机检查，但如果您指定了`proxy`设置，则启用它。
    // 最后，如果你真的知道你在使用一个特殊的环境变量，你可以重写它。
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',

    // 一切服务都启用 gzip 压缩
    compress: true,

    // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息，
    // 如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐。
    // 这里关闭 WebpackDevServer 自己的日志，因为它们通常没什么用。
    // 但是仍然会显示编译警告和错误。
    clientLogLevel: 'none',

    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
    // devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
    // 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录：
    // 注意，推荐使用绝对路径。但是也可以从多个目录提供内容。如下：
    // contentBase: [path.join(__dirname, "public"), path.join(__dirname, "assets")]
    // 默认情况下，WebpackDevServer 除了从内存中提供的所有虚拟构建产品之外，还提供来自当前目录的物理文件。
    // 这是令人困惑的，因为这些文件不会自动在生产构建文件夹中可用，除非我们复制它们。
    // 但是，复制整个项目目录是危险的，因为我们可能会暴露敏感文件。
    // 相反，我们建立一个只在 `public` 目录中提供公开文件的约定。
    // 我们的构建脚本会将 `public` 复制到 `build` 文件夹中。
    // 在 `index.html` 中，您可以使用 ％PUBLIC_URL％ 获取 `public` 文件夹的 URL：
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">。
    //  在JavaScript代码中，您可以使用 `process.env.PUBLIC_URL' 访问它。
    //  请注意，我们建议使用`public`文件夹作为`favicon.ico`，`manifest.json` 和由于某些原因从 Webpack 无法导入的库
    //  如果您只想使用图像，请将其放在`src`中，然后从JavaScript导入。
    contentBase: paths.appPublic,

    // 默认情况下，`contentBase` 的文件不会触发页面重新加载。
    watchContentBase: true,

    // 启用 webpack 的模块热替换特性。
    // 它将为 WebpackDevServer 客户端提供 /sockjs-node/ 端点，以便可以了解文件的更新时间。
    // WebpackDevServer 客户端作为 Webpack 开发配置中的入口点。
    // 请注意，只有 CSS 的更改目前正在重新加载。JS 更改将刷新浏览器。
    hot: true,

    // 告诉 WebpackDevServer 使用与我们在 config 中指定的相同的根路径是很重要的。在开发中，我们始终服务于/。
    publicPath: config.output.publicPath,

    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。
    // 这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: true,

    // 据报道，这避免了某些系统上的CPU过载。
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },

    // 如果设置 HTTPS 环境变量为 true，则开启 HTTPS 开关
    https: protocol === 'https',
    host,
    overlay: false,
    historyApiFallback: {
      // 带点的路径应该仍然使用 history 回退。
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true
    },
    public: allowedHost,
    proxy,
    setup(app) {
      // 这使我们可以在运行时错误重叠中打开文件。
      app.use(errorOverlayMiddleware());

      // service worker 文件实际上是一个“无操作”，将重置以前为同一主机注册的服务工作者：端口组合。
      // 我们在开发中这样做，以避免在使用相同的主机和端口时冲突生产缓存。
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    }
  };
};
