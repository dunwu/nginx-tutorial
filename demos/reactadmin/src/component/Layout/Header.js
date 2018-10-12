/**
 * @file 顶部布局组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Layout } from 'antd';
import React from 'react';

const { Header } = Layout;

/**
 * 顶部布局组件
 * @class
 */
class CustomHeader extends React.PureComponent {
  render() {
    return (
      <Header />
    );
  }
}
export default CustomHeader;

