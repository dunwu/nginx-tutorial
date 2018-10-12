/**
 * @file Sider-Header-Content-Footer 式页面级整体布局
 * @author Zhang Peng
 * @see https://ant.design/components/layout-cn/
 */
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import './index.less';
import Navpath from './Navpath';
import Sider from './Sider';

class CustomLayout extends React.PureComponent {
  static propTypes = {
    navpath: PropTypes.array
  };
  static defaultProps = {
    navpath: []
  };

  render() {
    const { navpath } = this.props;

    return (
      <Layout className="ant-layout-has-sider">
        <Sider />
        <Layout className="ant-layout-container">
          <Header />
          <Navpath data={navpath} />
          <Content type="SHCF">
            {this.props.children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  const { menu } = state;
  return {
    navpath: menu.navpath
  };
};

const mapDispatchToProps = () => {
  return {};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));
