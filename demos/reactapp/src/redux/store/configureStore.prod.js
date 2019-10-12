/**
 * @file 生产环境的 Store 构造器
 * @author Zhang Peng
 * @see https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md
 */

import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import promise from '../middlewares/promiseMiddleware'
import reducers from '../reducers'

const enhancer = applyMiddleware(thunk, promise)

/**
 * 生产环境的 Store 构造方法。
 * @param {Object} initialState 初始状态
 * @returns {Store<S>} Redux 的状态容器，一个应用只有一个
 */
function configureStore(initialState) {
  return createStore(reducers, initialState, enhancer)
}

export default configureStore
