/**
 * @file 面包屑组件
 * @author Zhang Peng
 * @see https://github.com/facebook/prop-types
 * @see https://ant.design/components/breadcrumb-cn/
 * @see https://ant.design/components/icon-cn/
 */
import { Breadcrumb, Icon } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import './Breadcrumb.less'

/**
 * 面包屑组件
 * @class
 */
class CustomBreadcrumb extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array
  }

  static defaultProps = {
    data: []
  }

  render() {
    const { data } = this.props
    const breadcrumbItems = data.map((item) => {
      return (
        <Breadcrumb.Item key={'bc-' + item.key}>
          <Icon type={item.icon}/>
          <span>{item.title}</span>
        </Breadcrumb.Item>
      )
    })

    return (
      <div className="ant-layout-breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item key='bc-0'>
            <Icon type="home"/>
            <span>Home</span>
          </Breadcrumb.Item>
          {breadcrumbItems}
        </Breadcrumb>
      </div>
    )
  }
}

export default CustomBreadcrumb
