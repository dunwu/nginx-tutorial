/**
 * @file React Router 入口。
 * <p>本项目使用 React Router 4.x</p>
 * @author Zhang Peng
 * @see https://reacttraining.com/react-router/
 * @see https://reacttraining.cn/
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import CoreContainer from '../containers/Core'
import Login from '../views/pages/login/Login'

/**
 * 子路由表
 */
export const ChildRoutes = [
  {
    'path': '/pages/home',
    'component': require('../views/pages/home/Home').default,
    'exactly': true
  },
  {
    'path': '/pages/mailbox',
    'component': require('../views/pages/mail/Mailbox').default
  },
  {
    'path': '/pages/user',
    'component': require('../views/pages/user/User').default
  }
]

/**
 * 默认路由
 * @type {XML}
 */
const Routes = (
  <Switch>
    <Route path="/login" component={Login}/>
    <Route path="/" component={CoreContainer}/>
  </Switch>
)
export default Routes
