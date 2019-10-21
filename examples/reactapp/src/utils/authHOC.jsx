/**
 * @file 对组件进行认证的方法
 * @author Zhang Peng
 * @see http://efe.baidu.com/blog/mixins-are-dead-long-live-the-composition/
 * @see https://zhuanlan.zhihu.com/p/24776678
 * @see https://segmentfault.com/a/1190000004598113
 */
import React from 'react'
import { withRouter } from 'react-router-dom'

/**
 * 校验方法
 * <p>如果不是登录状态，并且history路径名不是/login，将history置为/login</p>
 * @param props {PropsType<S>} 组件的props
 */
const validate = props => {
  const { history } = props
  const isLoggedIn = !!window.localStorage.getItem('uid')
  if (!isLoggedIn && history.location.pathname !== '/login') {
    history.replace('/login')
  }
}

/**
 * 对组件进行认证的方法
 * <p>使用 React 高阶组件技术包裹传入的组件，对组件中的 props 进行校验</p>
 * @param WrappedComponent {React.Component} 传入的组件
 * @returns {withRouter<S>}
 */
const authHOC = WrappedComponent => {
  class Authenticate extends React.Component {
    componentWillMount() {
      validate(this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        validate(nextProps)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return withRouter(Authenticate)
}
export default authHOC
