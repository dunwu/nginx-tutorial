/**
 * Created by Zhang Peng on 2017/6/14.
 */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const baseWebpackConfig = require('./webpack.config.base')

module.exports = webpackMerge(baseWebpackConfig, {
  // 这里应用程序开始执行
  // webpack 开始打包
  // 本例中 entry 为多入口
  entry: {
    main: [
      // App 入口
      path.resolve(__dirname, '../src/index')
    ]
  },

  // 关于模块配置
  module: {

    // 模块规则（配置 loader、解析器等选项）
    rules: [
      {
        // 图片加载 + 图片压缩
        test: /\.(png|svg|jpg|gif|ico)$/,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/images/[name].[hash:8].[ext]'
            }
          },

          {
            loader: 'image-webpack-loader',
            query: {
              progressive: true,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }

        ]
      }
    ]
  },

  // 附加插件列表
  plugins: [

    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    // 加载选项插件
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    // 压缩 js 插件
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false  // remove all comments
      },
      compress: {
        warnings: false
      }
    }),

    // 将样式文件独立打包
    new ExtractTextPlugin('styles.css')
  ]
})
