/**
 * @file Redux 创建Store入口，区分开发、生产环境
 * @author Zhang Peng
 * @see https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md
 */
// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./configureStore.dev').default
} else {
  module.exports = require('./configureStore.prod').default
}
