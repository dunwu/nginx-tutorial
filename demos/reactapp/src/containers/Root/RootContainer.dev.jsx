/**
 * @file 开发环境的 Root 容器
 * @author Zhang Peng
 * @see http://gaearon.github.io/react-hot-loader/getstarted/
 */
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import Routes from '../../routes'
import ReduxDevTools from './ReduxDevTools'
import configureStore from '../../redux/store/configureStore'

const store = configureStore()

/**
 * 开发环境的 Root 容器，会包含 Redux 的开发工具
 * @class
 */
class RootContainer extends React.PureComponent {
  render() {
    if (!this.routes) this.routes = Routes
    return (
      <Provider store={store}>
        <div>
          <Router children={this.routes}/>
          <ReduxDevTools/>
        </div>
      </Provider>
    )
  }
}

export default RootContainer
