import { Avatar, Card, Col, Row, Table } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import onPersonListSearch from './redux/actions';

class BasicTable extends React.PureComponent {
  state = {
    selectedRowKeys: [],
    filteredInfo: null,
    sortedInfo: null
  };

  componentWillMount() {
    this.props.onPersonListSearch();
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onChange = (pagination, filters, sorter) => {
    console.log('onChange parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  onExpand = (record) => {
    console.log('onExpand', record);
    const nodes = [];
    _.forIn(record, (value, key) => {
      nodes.push({ key, value });
    });

    return (
      <div style={{ marginTop: '12px' }}>
        <Card width="100%" title="详细信息" style={{ fontSize: '16px' }}>
          {nodes.map((node) => {
            return (
              <Row key={node.key}>
                <Col span={6}>
                  <h3 style={{ fontWeight: '600' }}>{node.key}</h3>
                </Col>
                <Col span={6}>
                  <span>{node.value}</span>
                </Col>
              </Row>
            );
          })}
        </Card>
      </div>
    );
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { table } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
          this.setState({
            selectedRowKeys: [...Array(46).keys()] // 0...45
          });
        }
      }, {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        }
      }, {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        }
      }],
      onSelection: this.onSelection
    };
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [{
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render(text, record) {
        return (<Avatar shape="square" size="large" src={record.avatar} icon="user" />);
      }
    }, {
      title: '登录名',
      dataIndex: 'loginName',
      key: 'loginName',
      sorter: (a, b) => a.loginName.length - b.loginName.length,
      sortOrder: sortedInfo.columnKey === 'loginName' && sortedInfo.order
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
    }, {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
      sorter: (a, b) => a.birthday - b.birthday,
      sortOrder: sortedInfo.columnKey === 'birthday' && sortedInfo.order
    }, {
      title: '邮件',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel'
    }, {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    }];
    return (
      <div>
        <Card title="基本表格示例">
          <Table
            rowKey="loginName"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={table.list}
            loading={table.loading}
            onChange={this.onChange}
            expandedRowRender={this.onExpand}
          />
        </Card>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    table: state.table
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onPersonListSearch: bindActionCreators(onPersonListSearch, dispatch)
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BasicTable));
