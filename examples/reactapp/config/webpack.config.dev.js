/**
 * Created by Zhang Peng on 2017/6/14.
 */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const baseWebpackConfig = require('./webpack.config.base')

module.exports = webpackMerge(baseWebpackConfig, {
  // 这里应用程序开始执行
  // webpack 开始打包
  // 本例中 entry 为多入口
  entry: {
    main: [
      // App 入口
      path.resolve(__dirname, '../src/index'),

      // 开启 React 代码的模块热替换(HMR)
      'react-hot-loader/patch',

      // 为 webpack-dev-server 的环境打包代码
      // 然后连接到指定服务器域名与端口
      'webpack-dev-server/client?http://localhost:9000',

      // 为热替换(HMR)打包好代码
      // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
      'webpack/hot/only-dev-server'
    ]
  },

  output: {
    // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
    publicPath: '/'
  },

  // 关于模块配置
  module: {

    // 模块规则（配置 loader、解析器等选项）
    rules: [

      {
        // 图片加载 + 图片压缩
        test: /\.(png|svg|jpg|gif|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/images/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  // 附加插件列表
  plugins: [

    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    // 开启全局的模块热替换(HMR)
    new webpack.HotModuleReplacementPlugin(),

    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.NamedModulesPlugin(),

    // 自动打开浏览器
    new OpenBrowserPlugin({
      url: 'http://localhost:9000'
    })
  ],

  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // devtool: "source-map", // 牺牲了构建速度的 `source-map' 是最详细的
  // devtool: "inline-source-map", // 嵌入到源文件中
  // devtool: "eval-source-map", // 将 SourceMap 嵌入到每个模块中
  // devtool: "hidden-source-map", // SourceMap 不在源文件中引用
  // devtool: "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
  devtool: 'eval-source-map', // 有模块映射(module mappings)的 SourceMap 低级变体
  // devtool: "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。

  devServer: {
    contentBase: [path.join(__dirname, '../dist')],
    compress: true,
    port: 9000, // 启动端口号
    hot: true, // 启用 webpack 的模块热替换特性
    inline: true,
    publicPath: '/', // 和上文 output 的“publicPath”值保持一致
    historyApiFallback: true
  }
})
