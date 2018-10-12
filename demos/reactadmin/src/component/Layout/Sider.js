/**
 * @file 侧边导航栏组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Layout } from 'antd';
import React from 'react';
import Menu from './Menu';
import Logo from './Logo';

const { Sider } = Layout;

/**
 * 侧边导航栏组件。侧边栏采用的响应式布局方式，页面大小收缩到一定程度，侧边栏会隐藏。
 * @class
 */
class CustomSider extends React.PureComponent {
  render() {
    return (
      /**
       * 响应式布局
       * 说明：配置 breakpoint 属性即生效，视窗宽度小于 breakpoint 时 Sider 缩小为 collapsedWidth 宽度，
       * 若将 collapsedWidth 设置为零，会出现特殊 trigger。
       */
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Logo />
        <Menu mode="inline" />
      </Sider>
    );
  }
}
export default CustomSider;
