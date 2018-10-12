/**
 * @file 内容布局组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 * @see https://ant.design/components/card-cn/
 */
import { Layout } from 'antd';
import React from 'react';

const { Content } = Layout;

/**
 * 内容布局组件
 * @class
 */
class CustomContent extends React.PureComponent {
  render() {
    return (
      <Content>
        {this.props.children}
      </Content>
    );
  }
}
export default CustomContent;
