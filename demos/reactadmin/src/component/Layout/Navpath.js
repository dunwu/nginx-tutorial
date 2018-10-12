/**
 * @file 面包屑组件
 * @author Zhang Peng
 * @see https://github.com/facebook/prop-types
 * @see https://ant.design/components/breadcrumb-cn/
 * @see https://ant.design/components/icon-cn/
 */
import { Breadcrumb, Col, Icon, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getPathsAndKeyPath from './common';

/**
 * 面包屑组件
 * @class
 */
class Navpath extends React.PureComponent {
  render() {
    const { menu, router } = this.props;
    // 根据选中菜单项的关键 key 数组获取对应组件
    const paths = [];
    const keyPath = [];
    getPathsAndKeyPath(router, menu, paths, keyPath);

    const breadcrumbItems = paths.map((item) => {
      return (
        <Breadcrumb.Item key={item.key}>
          <Icon type={item.icon} />
          <span>{item.title}</span>
        </Breadcrumb.Item>
      );
    });

    let tilte;
    if (paths && paths.length > 0) {
      tilte = paths[paths.length - 1].title;
    }
    return (
      <div className="navpath">
        <Row>
          <Col xs={0} sm={12} md={12} lg={12} xl={12}>
            <span className="title">{tilte}</span>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Breadcrumb separator=">">
              {breadcrumbItems}
            </Breadcrumb>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    menu: state.menu,
    router: state.router
  };
}
export default withRouter(connect(mapStateToProps)(Navpath));
