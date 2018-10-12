/**
 * @file redux store 构造器
 * @author Zhang Peng
 * @description redux store 构造器。根据开发环境和非开发环境分别集成所需的 redux 中间件。
 * @see https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md
 * @see https://github.com/gaearon/redux-thunk
 * @see https://github.com/reactjs/react-router-redux
 * @see https://github.com/evgenyrodionov/redux-logger
 */
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import history from './history';
import rootReducer from './rootReducer';

// 本项目所使用的基本的 redux 中间件
const router = routerMiddleware(history);
const middlewares = [thunk, router];

let enhancer;
if (process.env.NODE_ENV === 'development') {
  // 非生产环境额外添加 redux-logger
  const createLogger = require('redux-logger').createLogger;
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  // 支持 redux 开发工具
  // @see https://github.com/zalmoxisus/redux-devtools-extension
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(
    // Middleware you want to use in development:
    applyMiddleware(...middlewares),
  );
} else {
  enhancer = applyMiddleware(...middlewares);
}

// 创建 Redux Store，这是本应用唯一的状态管理容器
const configStore = (initialState) => {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/reactjs/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./rootReducer', () =>
      store.replaceReducer(require('./rootReducer').default)
    );
  }

  return store;
};
const store = configStore();
export default store;
