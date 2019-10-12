/**
 * @file 应用的核心容器组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Layout } from 'antd'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import './CoreContainer.less'
import { authHOC } from '../../utils'
import { ChildRoutes } from '../../routes'
import { Content, Footer, Header, Sidebar } from '../../components'

/**
 * 应用的核心容器组件
 * <p>控制整个页面的布局。整体采用的是侧边布局。</p>
 * @class
 */
class CoreContainer extends React.PureComponent {
  render() {
    return (
      <Layout className="ant-layout-has-sider">
        <Sidebar/>
        <Layout>
          <Header/>
          <Layout className="ant-layout-container">
            <Content>
              <Redirect to="/pages/home"/>
              {ChildRoutes.map((route, index) => (
                <Route key={index} path={route.path} component={authHOC(route.component)} exactly={route.exactly}/>
              ))}
            </Content>
          </Layout>
          <Footer/>
        </Layout>
      </Layout>
    )
  }
}

export default CoreContainer
