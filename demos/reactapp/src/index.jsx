/**
 * @file App 的总入口
 * @author Zhang Peng
 * @see http://gaearon.github.io/react-hot-loader/getstarted/
 */
import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import RootContainer from './containers/Root/RootContainer'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root')
  )
}

// 初次启动 App
render(RootContainer)

// 热替换启动 App
if (module.hot) {
  module.hot.accept('./containers/Root/RootContainer', () => {
    const NextRootContainer = require('./containers/Root/RootContainer')
    render(NextRootContainer)
  })
}
