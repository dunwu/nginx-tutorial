/**
 * Created by Zhang Peng on 2017/7/21.
 */
import React from 'react'
import './Home.less'

import logo from './logo.svg'

export default class Home extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to REACT ADMIN</h1>
        </header>
        <p className="App-intro">
          REACT ADMIN is developing。。。
        </p>
      </div>
    )
  }
}
