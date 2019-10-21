/**
 * @file 顶部布局组件
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Avatar, Badge, Col, Dropdown, Icon, Layout, Menu, Popover, Row } from 'antd'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import './Header.less'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import { fetchProfile, logout } from '../../../redux/actions/auth'

const { Header } = Layout

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
    <p>Content</p>
    <p>Content</p>
    <p>Content</p>
  </div>
)

const mapStateToProps = (state) => {
  const { auth, menu } = state
  return {
    auth: auth ? auth : null,
    navpath: menu.navpath
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ fetchProfile, logout }, dispatch) }
}

/**
 * 顶部布局组件
 * @class
 */
class CustomHeader extends React.PureComponent {
  static propTypes = {
    auth: PropTypes.object,
    actions: PropTypes.object,
    navpath: PropTypes.array
  }
  static defaultProps = {
    auth: null,
    actions: null,
    navpath: []
  }

  componentWillMount() {
    const { actions } = this.props
    actions.fetchProfile()
  }

  handleLogOut = () => {
    const { actions } = this.props
    actions.logout().payload.promise.then(() => {
      this.props.history.replace('/login')
    })
  }

  render() {
    const { auth, navpath } = this.props
    let username = ''
    if (auth.user) {
      if (auth.user.data) {
        username = auth.user.data.name
      }
    }

    const menu = (
      <Menu>
        <Menu.Item key="1">
          选项1
        </Menu.Item>
        <Menu.Item key="2">
          选项2
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <a onClick={this.handleLogOut}>注销</a>
        </Menu.Item>
      </Menu>
    )

    return (
      <Header className="ant-layout-header">
        <Row type="flex" align="middle">
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Breadcrumb data={navpath}/>
          </Col>
          <Col xs={0} sm={2} md={4} lg={8} xl={8}/>
          <Col xs={0} sm={6} md={6} lg={4} xl={4}>
            <Badge className="header-icon" count={5}>
              <Link to="/pages/mailbox">
                <Icon type="mail"/>
              </Link>
            </Badge>
            <Popover content={content} title="Title" trigger="click">
              <Badge className="header-icon" dot>
                <a href="#">
                  <Icon type="notification"/>
                </a>
              </Badge>
            </Popover>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                <Avatar shape="circle" style={{ verticalAlign: 'middle', backgroundColor: '#00a2ae' }} size="large">
                  {username}
                </Avatar>
                <Icon type="down"/>
              </a>
            </Dropdown>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomHeader))

