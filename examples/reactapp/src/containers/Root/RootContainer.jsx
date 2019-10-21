/**
 * @file Root 容器模块是 antd-admin 的根组件
 * @author Zhang Peng
 * @see http://gaearon.github.io/react-hot-loader/getstarted/
 */
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./RootContainer.dev')
  console.log('[development] Root.dev started.')
} else {
  module.exports = require('./RootContainer.prod')
  console.log('[production] Root.prod started.')
}
