import React from 'react'
import { Alert, Button, Col, Input, Row, Select, Table } from 'antd'
import './User.less'

const { Option, OptGroup } = Select

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  filters: [{
    text: 'Joe',
    value: 'Joe'
  }, {
    text: 'Jim',
    value: 'Jim'
  }, {
    text: 'Submenu',
    value: 'Submenu',
    children: [{
      text: 'Green',
      value: 'Green'
    }, {
      text: 'Black',
      value: 'Black'
    }]
  }],
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  onFilter: (value, record) => record.name.indexOf(value) === 0,
  sorter: (a, b) => a.name.length - b.name.length
}, {
  title: 'Age',
  dataIndex: 'age',
  sorter: (a, b) => a.age - b.age
}, {
  title: 'Address',
  dataIndex: 'address',
  filters: [{
    text: 'London',
    value: 'London'
  }, {
    text: 'New York',
    value: 'New York'
  }],
  filterMultiple: false,
  onFilter: (value, record) => record.address.indexOf(value) === 0,
  sorter: (a, b) => a.address.length - b.address.length
}]

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park'
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park'
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park'
}, {
  key: '4',
  name: 'Jim Red',
  age: 32,
  address: 'London No. 2 Lake Park'
}]

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter)
}

export default class UserView extends React.Component {
  render() {
    return (
      <div className="user-view-row">
        <div>
          <Row gutter={16} className="user-view-row">
            <Col span={1}>工号：</Col>
            <Col span={7}><Input name="user" placeholder="请输入"/></Col>
            <Col span={1}>姓名：</Col>
            <Col span={7}><Input placeholder="请输入"/></Col>
            <Col span={1}>部门：</Col>
            <Col span={7}>
              <Select
                defaultValue="lucy"
                style={{ width: 200 }}
              >
                <OptGroup label="Manager">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </OptGroup>
                <OptGroup label="Engineer">
                  <Option value="Yiminghe">yiminghe</Option>
                </OptGroup>
              </Select>
            </Col>
          </Row>
        </div>

        <div>
          <Row gutter={16} className="user-view-row">
            <Col span={1}>状态：</Col>
            <Col span={7}>
              <Select
                defaultValue="lucy"
                style={{ width: 200 }}
              >
              </Select>
            </Col>
            <Col span={1}>修改时间：</Col>
            <Col span={7}><Input placeholder="请输入"/></Col>
            <Col span={1}/>
            <Col span={7}/>
          </Row>
        </div>

        <div>
          <Row gutter={16} justify="end" className="user-view-row">
            <Col span="{8]"/>
            <Col span="{8]"/>
            <Col span="{8]">
              <Button type="primary">搜索</Button>
              <Button>重置</Button>
            </Col>
          </Row>
        </div>

        <div className="user-view-row"><Button type="primary">添加用户</Button></div>

        <div className="user-view-row">
          <Alert message="已选择 2 项" type="info" showIcon/>
        </div>

        <div className="user-view-row">
          <Table columns={columns} dataSource={data} onChange={onChange}/>
        </div>
      </div>
    )
  }
}
