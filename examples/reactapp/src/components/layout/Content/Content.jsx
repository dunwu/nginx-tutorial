/**
 * @file 内容布局组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 * @see https://ant.design/components/card-cn/
 */
import { Card, Layout } from 'antd'
import React from 'react'

import './Content.less'

const { Content } = Layout

/**
 * 内容布局组件
 * @class
 */
class CustomContent extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Content className="ant-layout-content">
        <Card noHovering bordered={false} bodyStyle={{ padding: 0 }}>
          {this.props.children}
        </Card>
      </Content>
    )
  }
}

export default CustomContent
