/**
 * @file 生产环境的 Root 容器
 * @author Zhang Peng
 * @see http://gaearon.github.io/react-hot-loader/getstarted/
 */
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import Routes from '../../routes'
import configureStore from '../../redux/store/configureStore'

const store = configureStore()

/**
 * 生产环境的 Root 容器
 * @class
 */
class RootContainer extends React.PureComponent {
  render() {
    if (!this.routes) this.routes = Routes
    return (
      <Provider store={store}>
        <Router children={this.routes}/>
      </Provider>
    )
  }
}

export default RootContainer
