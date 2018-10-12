/**
 * @file webpack 开发模式配置
 * @see https://doc.webpack-china.org/configuration/
 */
const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// Webpack 使用 `publicPath` 来确定应用程序在哪里发送。
// 在开发模式中，我们始终从 root 上服务。这使配置更容易。
const publicPath = '/';
// `publicUrl` 就像`publicPath`，但是我们将把它提供给我们的应用程序，
// 就像 ％PUBLIC_URL％ 在 'index.html` 和 'process.env.PUBLIC_URL` 在 JavaScript 中 。
// 省略尾随斜线，%PUBLIC_PATH%/xyz 看起来比 %PUBLIC_PATH%xyz 好。
const publicUrl = '';
// 获取环境变量以注入到应用程序中。
const env = getClientEnvironment(publicUrl);

// 这是开发模式配置。
// 它专注于开发人员的经验和快速的重新构建。
// 与生产模式配置不同，它存在于一个单独的文件中。
module.exports = {

  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  devtool: 'cheap-module-source-map',

  // webpack 打包入口
  // 这意味着它们将是 JS 捆绑包中包含的根
  // 前两个入口点启用 "hot" CSS 和自动刷新 JS。
  entry: [

    // 我们默认加载几个 polyfills
    // require.resolve('./polyfills'),

    // 为 WebpackDevServer 添加备用客户端。
    // 客户端的工作是通过 socket 连接到 WebpackDevServer，并获得有关更改的通知。
    // 保存文件时，客户端将应用热更新（在更改CSS的情况下）或刷新页面（如果是JS更改）。
    // 当您发出语法错误时，此客户端将显示语法错误覆盖。
    // 注意：代替默认的 WebpackDevServer 客户端，我们使用自定义的方式为创建 React App 用户带来更好的体验。
    // 如果您喜欢 stock 客户端，您可以用以下两行代替以下行：
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),

    // 您的应用程序的代码入口
    // 我们最后包含应用程序代码，以便如果在初始化期间有运行时错误，
    // 它不会破坏 WebpackDevServer 客户端，并且更改 JS 代码仍将触发刷新。
    paths.appIndexJs
  ],

  // webpack 如何输出结果的相关选项
  output: {

    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    // 下一行未在 dev 中使用，但是没有它 WebpackDevServer 会崩溃：
    path: paths.appBuild,

    // 在输出中添加 /* filename */ 注释来生成require（）。
    pathinfo: true,

    // 「入口分块(entry chunk)」的文件名模板
    // 这不会产生真实的文件。
    // 这只是WebpackDevServer在开发中提供的虚拟路径。
    // 这是包含所有入口点的代码和Webpack运行时的JS包。
    filename: 'static/js/bundle.js',

    // 「附加分块(additional chunk)」的文件名模板（如果你使用代码分离）
    chunkFilename: 'static/js/[name].chunk.js',

    // 输出解析文件的目录，url 相对于 HTML 页面。开发模式下，我们使用 "/"
    publicPath,

    // 将源映射条目指向原始磁盘位置（格式为Windows上的URL）
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },

  // 解析模块请求的选项
  resolve: {

    // 用于查找模块的目录。
    // 我们把这些路径放在第二位，因为我们想要“node_modules”来“赢”
    // 如果有任何冲突。这符合 Node 的解析机制。
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),

    // 使用的扩展名
    extensions: ['.js', '.json', '.jsx', '.css', '.less'],

    // 模块别名列表
    alias: {
      // 支持 React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web'
    },

    // 附加插件列表
    plugins: [

      // 防止用户从 src /（或node_modules/）外部导入文件。
      // 这通常会导致混乱，因为我们只处理 src/ 中的文件与 babel。
      // 为了解决这个问题，我们阻止你从 src/ 外部导入文件。
      // 如果你非要这么做，请将文件链接到您的 node_modules/，并让 module-resolution 起作用。
      // 确保你的源文件被编译，因为它们不会以任何方式处理。
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
    ]
  },

  // 模块配置
  module: {
    strictExportPresence: true,

    // 模块规则（配置 loader、解析器等选项）
    rules: [

      // 首先，运行 ESLint
      // 在 Babel 处理 JS 之前做这件事很重要。
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre', // 标识应用这些规则，即使规则覆盖（高级选项）
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              configFile: paths.appConfig.concat('/.eslintrc.js')
            },
            loader: require.resolve('eslint-loader')
          }
        ],
        include: paths.appSrc
      },
      {
        // “oneOf”将遍历所有以下 loader，直到有一个符合要求。
        // 当没有 loader 匹配时，它会返回 loader 列表末尾的 loader。
        oneOf: [
          // url-loader 就像 file-loader 一样工作，但如果文件小于限制，则可以返回 DataURL。
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          // JS 解析器，使得浏览器可以识别 ES6/React 等语法
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              // 这是 babel-loader（不是Babel本身）的一个功能。
              // 它允许缓存结果在 ./node_modules/.cache/babel-loader/ 目录下，使得重新构建更快。
              cacheDirectory: true
            }
          },
          // 这里的符号有点令人困惑。
          // postcss-loader 将 autoprefixer 应用于我们的CSS。
          // css-loader 解析 CSS 中的路径，并将资源添加为依赖关系。
          // style-loader 通常将 CSS 转换为注入<style>的 JS 模块，
          // 在生产模式中，我们使用一个插件将该 CSS 提取到一个文件中，
          // 但在开发模式中，style-loader 可以实现对 CSS 的热编辑。
          // @see https://github.com/webpack-contrib/style-loader
          // @see https://github.com/webpack-contrib/css-loader
          // @see https://github.com/postcss/postcss-loader
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // 导入外部 CSS 时必不可少N
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9' // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009'
                    })
                  ]
                }
              }
            ]
          },
          // less 完全兼容 css 语法。对于 less 文件，先交给 style-loader 、css-loader 处理。
          // 如果存在 less 自身的特性，则交给 less-loader 去处理。
          // @see https://github.com/webpack-contrib/less-loader
          {
            test: /\.less$/,
            use: [{
              loader: 'style-loader'
            }, {
              loader: 'css-loader'
            }, {
              loader: 'less-loader',
              options: {
                strictMath: true,
                noIeCompat: true
              }
            }]
          },
          // file-loader 确保资源文件最终在输出文件夹中。
          // 当您导入资产时，您将获得其文件名。
          // 这个装载器不使用“测试”，所以它将捕获所有未匹配其它 loader 的模块
          {
            loader: require.resolve('file-loader'),

            // 排除`js`文件以保持 css-loader 在注入时工作
            // 它是运行时，否则将通过 file-loader 处理。
            // 还可以排除`html`和`json`扩展名，以便它们通过 webpack 内部装载机得到处理
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
          // 【结束】如果需要添加新的 loader，请确保在 file-loader 之前。
        ]
      }
    ]
  },
  plugins: [
    // 使一些环境变量可用于JS代码。
    // 例如：if（process.env.NODE_ENV ==='production'）{...}。请参阅 `./env.js`。
    // 在这里设置 NODE_ENV 是绝对必要的。否则React将以非常缓慢的开发模式进行编译。
    new webpack.DefinePlugin(env.stringified),

    // Moment.js是一个非常受欢迎的日期相关的库，可以捆绑大型语言环境文件，默认情况下由于Webpack解释其代码。
    // 这是一个实用的解决方案，要求用户选择导入特定区域设置。
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // 如果你不使用 Moment.js，可以移除
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 开启全局的模块热替换(HMR)
    new webpack.HotModuleReplacementPlugin(),

    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.NamedModulesPlugin(),

    // 在 index.html 中提供一些环境变量。
    // 公共 URL 在 index.html 中以 ％PUBLIC_URL％ 的形式提供，
    // 例如：<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // 在生产模式中，在 `package.json` 中指定 "homepage" ，它将是该URL的路径名；否则它将是一个空字符串，
    new InterpolateHtmlPlugin(env.raw),

    // 使用注入的<script>生成一个`index.html`文件。
    // @see https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),

    // 如果您在路径中输入错误的大小写，则 Watcher 无法正常工作，因此当您尝试执行此操作时，我们使用打印错误的插件。
    // @see https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),

    // 如果您需要一个缺少的模块，然后 `npm install` 它 ，那么您仍然需要重新启动 Webpack 的开发服务器来发现它。
    // 此插件可以自动发现缺少的模块，使您不必重新启动。
    // @see https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],

  // 某些库导入 Node 模块，但不要在浏览器中使用它们。
  // 告诉 Webpack 为他们提供空的模拟，以便导入它们。
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },

  // 在开发过程中关闭性能提示，因为我们不会为了追求速度进行代码分离或压缩。这些警告变得很麻烦。
  performance: {
    hints: false
  }
};
