/**
 * @file 侧边导航栏组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Icon, Layout, Menu } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { matchPath, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import './Sidebar.less'
import logoImg from './antd.svg'
import { refreshMenu, refreshNavPath } from '../../../redux/actions/menu'

const { Sider } = Layout

const isActive = (path, history) => {
  return matchPath(path, {
    path: history.location.pathname,
    exact: true,
    strict: false
  })
}

/**
 * 侧边导航栏组件。侧边栏采用的响应式布局方式，页面大小收缩到一定程度，侧边栏会隐藏。
 * @class
 */
class CustomSidebar extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array
  }
  static defaultProps = {
    items: []
  }

  state = {
    openKey: 'sub0',
    activeKey: 'menu0',
    mode: 'inline'
  }

  componentDidMount() {
    this.props.getAllMenu()
  }

  componentWillReceiveProps(nextProps) {
    Array.isArray(nextProps.items) && nextProps.items.map((item, i) => {
      Array.isArray(item.children) && item.children.map((node) => {
        if (node.url && isActive(node.url, this.props.history)) {
          this.menuClickHandle({
            key: 'menu' + node.key,
            keyPath: ['menu' + node.key, 'sub' + item.key]
          })
        }
      })
    })
  }

  menuClickHandle = (item) => {
    this.setState({
      activeKey: item.key
    })
    this.props.updateNavPath(item.keyPath, item.key)
  }

  render() {
    const { items, history } = this.props
    let { activeKey, openKey } = this.state

    const _menuProcess = (nodes, pkey) => {
      return Array.isArray(nodes) && nodes.map((item, i) => {
        const menu = _menuProcess(item.children, item.key)
        if (item.url && isActive(item.url, history)) {
          activeKey = 'menu' + item.key
          openKey = 'sub' + pkey
        }

        switch (item.type) {

          case 'SubMenu':
            return (
              <Menu.SubMenu
                key={item.key}
                title={<span><Icon type={item.icon}/><span className="nav-text">{item.title}</span></span>}
              >
                {menu}
              </Menu.SubMenu>
            )
          case 'ItemGroup':
            return (
              <Menu.ItemGroup
                key={item.key}
                title={<span><Icon type={item.icon}/><span className="nav-text">{item.title}</span></span>}
              >
                {menu}
              </Menu.ItemGroup>
            )
          case 'Divider':
            return (
              <Menu.Divider key={item.key}/>
            )
          case 'Item':
          default:
            return (
              <Menu.Item className="ant-menu-item" key={item.key}>
                {
                  item.url ? <Link to={item.url}>{item.icon && <Icon type={item.icon}/>}{item.title}</Link> :
                    <span>{item.icon && <Icon type={item.icon}/>}{item.title}</span>
                }
              </Menu.Item>
            )
            break
        }
      })
    }

    const menu = _menuProcess(items)

    return (
      /**
       * 响应式布局
       * 说明：配置 breakpoint 属性即生效，视窗宽度小于 breakpoint 时 Sider 缩小为 collapsedWidth 宽度，
       * 若将 collapsedWidth 设置为零，会出现特殊 trigger。
       */
      <Sider className="ant-layout-sider"
             breakpoint="lg"
             collapsedWidth="0"
      >
        <div className="ant-layout-logo">
          <div className="logo-container">
            <img src={logoImg}/>
            <span>Ant Design</span>
          </div>
        </div>
        <Menu className="ant-menu"
              mode={this.state.mode} theme="dark"
              selectedKeys={[activeKey]}
              defaultOpenKeys={[openKey]}
              onClick={this.menuClickHandle}
        >
          {menu}
        </Menu>
      </Sider>
    )
  }
}

function mapStateToProps(state) {
  return {
    items: state.menu.items
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllMenu: bindActionCreators(refreshMenu, dispatch),
    updateNavPath: bindActionCreators(refreshNavPath, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomSidebar))
