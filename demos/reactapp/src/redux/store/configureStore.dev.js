/**
 * @file 开发环境的 Store 构造器
 * @author Zhang Peng
 * @see https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md
 */

import { applyMiddleware, compose, createStore } from 'redux'
import { persistState } from 'redux-devtools'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import DevTools from '../../containers/Root/ReduxDevTools'
import promise from '../middlewares/promiseMiddleware'
import reducers from '../reducers'

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunk, logger, promise),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
)

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  return (matches && matches.length > 0) ? matches[1] : null
}

/**
 * 开发环境的 Store 构造方法。与生产环境的 Store 构造方法相比，将创建的 Store 中多了开发工具。
 * @param {Object} initialState 初始状态
 * @returns {Store<S>} Redux 的状态容器，一个应用只有一个
 */
function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/reactjs/redux/releases/tag/v3.1.0
  const store = createStore(reducers, initialState, enhancer)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}

export default configureStore
