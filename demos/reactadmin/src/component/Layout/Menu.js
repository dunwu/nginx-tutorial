/**
 * @file 侧边导航栏组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Icon, Menu, Spin } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import getPathsAndKeyPath from './common';
import { onMenuItemSelected, onMenuListSearch } from './redux/actions';

/**
 * 根据查询数据，动态加载菜单项
 */
class CustomMenu extends React.PureComponent {
  state = {
    paths: [],
    keyPath: [],
    mode: 'inline'
  };

  componentWillMount() {
    this.props.onMenuListSearch();
    this.setState({
      mode: this.props.mode
    });
  }

  render() {
    const { menu, router } = this.props;

    // 根据选中菜单项的关键 key 数组获取对应组件
    const paths = [];
    const keyPath = [];
    getPathsAndKeyPath(router, menu, paths, keyPath);
    const getMenuItems = (list) => {
      return Array.isArray(list) && list.map((item) => {
        const menus = getMenuItems(item.children, item.key);
        switch (item.type) {
        case 'SubMenu':
          return (
            <Menu.SubMenu
              key={item.key}
              title={<span><Icon type={item.icon} /><span className="nav-text">{item.title}</span></span>}
            >
              {menus}
            </Menu.SubMenu>
          );
        case 'ItemGroup':
          return (
            <Menu.ItemGroup
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />&nbsp;
                  <span className="nav-text">{item.title}</span>
                </span>
              }
            >
              {menus}
            </Menu.ItemGroup>
          );
        case 'Divider':
          return (
            <Menu.Divider key={item.key} />
          );
        case 'Item':
        default:
          return (
            <Menu.Item key={item.key}>
              {
                item.url ? (
                  <Link to={item.url}>
                    {item.icon && <Icon type={item.icon} />}<span className="nav-text">{item.title}</span>
                  </Link>
                ) : (
                  <span>
                    {item.icon && <Icon type={item.icon} />}<span className="nav-text">{item.title}</span>
                  </span>
                )
              }
            </Menu.Item>
          );
        }
      });
    };

    return (
      <Spin spinning={menu.loading} delay={500} size="large" tip="Loading...">
        <Menu
          className="sider-menu"
          mode={this.state.mode}
          theme="dark"
          selectedKeys={keyPath}
          defaultOpenKeys={['ui']}
        >
          {getMenuItems(menu.list)}
        </Menu>
      </Spin>
    );
  }
}
function mapStateToProps(state) {
  return {
    menu: state.menu,
    router: state.router
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onMenuListSearch: bindActionCreators(onMenuListSearch, dispatch),
    onMenuItemSelected: bindActionCreators(onMenuItemSelected, dispatch)
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomMenu));
