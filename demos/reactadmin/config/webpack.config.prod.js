/**
 * @file webpack 生产模式配置
 * @see https://doc.webpack-china.org/configuration/
 */
const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

// Webpack 使用 `publicPath` 来确定应用程序在哪里发送。
// 它需要尾部斜线，否则文件资源将获得不正确的路径。
const publicPath = paths.servedPath;
// 某些应用程序不使用 pushState 的客户端路由。
// 对于这些，"homepage" 可以设置为 "."。以启用相对路径。
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps 较大，可能会导致因为源文件太大而内存不足的问题。
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` 就像`publicPath`，但是我们将把它提供给我们的应用程序，
// 就像 ％PUBLIC_URL％ 在 'index.html` 和 'process.env.PUBLIC_URL` 在 JavaScript 中 。
// 省略尾随斜线，%PUBLIC_PATH%/xyz 看起来比 %PUBLIC_PATH%xyz 好。
const publicUrl = publicPath.slice(0, -1);
// 获取环境变量以注入到应用程序中。
const env = getClientEnvironment(publicUrl);

// 这里断言是为了安全。
// React 的开发模式构建比较慢，不适合于生产环境
// if (env.stringified['process.env'].NODE_ENV !== '"production"') {
//   throw new Error('Production builds must have NODE_ENV=production.');
// }

// 注意：在这里定义，因为它将被使用不止一次。
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin 期望构建的输出平稳。
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// 但是，我们的输出结构使用 css，js 和 media 文件夹。
// 要使这个结构可以作用于相对路径，我们必须使用自定义选项。
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // 确保 publicPath 返回到构建文件夹。
  { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

// 这是生产环境的配置
// 它编译速度较慢并专注于生成一个快速和最小化的包。
module.exports = {
  // 在第一个错误出错时抛出，而不是无视错误。
  bail: true,

  // 我们在生产中生成 sourcemaps。这很慢，但效果不错。
  // 您可以在部署期间从构建中排除* .map文件。
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  devtool: shouldUseSourceMap ? 'source-map' : false,

  // webpack 打包入口
  // 在生产环境中，我们仅仅想加载 polyfills 和 app 的代码.
  entry: [
    // require.resolve('./polyfills'),

    // 您的应用程序的代码入口
    // 我们最后包含应用程序代码，以便如果在初始化期间有运行时错误，
    // 它不会破坏 WebpackDevServer 客户端，并且更改 JS 代码仍将触发刷新。
    paths.appIndexJs
  ],

  // webpack 如何输出结果的相关选项
  output: {

    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: paths.appBuild,

    // 「入口分块(entry chunk)」的文件名模板
    // 生成的JS文件名（带有嵌套文件夹）将有一个主要的bundle，每个异步块有一个文件。
    // filename: "static/js/[name].js", // 用于多个入口点
    filename: 'static/js/[name].[chunkhash:8].js', // 用于长效缓存

    // 「附加分块(additional chunk)」的文件名模板
    // chunkFilename: "static/js/[name].js", // 用于多个入口点
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js', // 用于长效缓存

    // 输出解析文件的目录，url 相对于 HTML 页面。
    publicPath,

    // 「devtool 中模块」的文件名模板
    devtoolModuleFilenameTemplate: info =>
      path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
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
              compact: true
            }
          },
          // 这里的符号有点令人困惑。
          // postcss-loader 将 autoprefixer 应用于我们的CSS。
          // css-loader 解析 CSS 中的路径，并将资源添加为依赖关系。
          // style-loader 通常将 CSS 转换为注入<style>的 JS 模块，
          // 但与开发配置不同，我们做的不同。
          // “ExtractTextPlugin”首先应用 postcss-loader 和 css-loader（第二个参数），
          // 然后抓取 CSS 编译结果并将其放入我们构建过程中的一个单独文件。
          // 这样，我们实际上是在生产环境输出一个单独的CSS文件，而不是在JS代码中注入<style>标签。
          // 但是，如果您使用代码分割，则任何异步包仍然使用 style-loader 解析异步代码中的 CSS，
          // 因此它们不会出现在 main CSS 文件中。
          // @see https://github.com/webpack-contrib/style-loader
          // @see https://github.com/webpack-contrib/css-loader
          // @see https://github.com/postcss/postcss-loader
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: require.resolve('style-loader'),
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap
                      }
                    },
                    {
                      loader: require.resolve('postcss-loader'),
                      options: {
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
                extractTextPluginOptions
              )
            )
            // 注意：如果`plugins`中没有 ExtractTextPlugin，这将不起作用。
          },
          // less 完全兼容 css 语法。对于 less 文件，先交给 style-loader 、css-loader 处理。
          // 如果存在 less 自身的特性，则交给 less-loader 去处理。
          // 与开发模式不同，这里使用了 ExtractTextPlugin
          // @see https://github.com/webpack-contrib/less-loader
          {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: require.resolve('style-loader'),
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap
                      }
                    },
                    {
                      loader: require.resolve('less-loader')
                    }
                  ]
                },
                extractTextPluginOptions
              )
            )
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

    // 压缩代码大小
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // 由于Uglify出现问题而导致看似有效的代码被禁用：
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // 待进一步调查：
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      output: {
        comments: false,
        // 打开它因为表情符号和正则表达式使用默认值没有正确地进行调整
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true
      },
      sourceMap: shouldUseSourceMap
    }),

    // Moment.js是一个非常受欢迎的日期相关的库，可以捆绑大型语言环境文件，默认情况下由于Webpack解释其代码。
    // 这是一个实用的解决方案，要求用户选择导入特定区域设置。
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // 如果你不使用 Moment.js，可以移除
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 在 index.html 中提供一些环境变量。
    // 公共 URL 在 index.html 中以 ％PUBLIC_URL％ 的形式提供，
    // 例如：<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // 在生产模式中，在 `package.json` 中指定 "homepage" ，它将是该URL的路径名；否则它将是一个空字符串，
    new InterpolateHtmlPlugin(env.raw),

    // 使用注入的<script>生成一个`index.html`文件。
    // @see https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    // 将文本从包中提取到文件中。
    // 注意：如果在“loader”中没有 ExtractTextPlugin.extract（..），这将不起作用。
    // @see https://github.com/webpack-contrib/extract-text-webpack-plugin
    new ExtractTextPlugin({
      filename: cssFilename
    }),

    // 生成一个 manifest 文件，它包含所有资源文件到相应输出文件的映射清单。
    // 这使得工具可以无需解析 `index.html` 就找到资源。
    // @see https://github.com/danethurber/webpack-manifest-plugin
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ],

  // 某些库导入 Node 模块，但不要在浏览器中使用它们。
  // 告诉 Webpack 为他们提供空的模拟，以便导入它们。
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
