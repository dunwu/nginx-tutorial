import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import { push } from 'react-router-redux';
import { store } from '../../../common';
import './style.less';

const { Option } = Select;

export default class Step1 extends React.PureComponent {
  render() {
    const { formItemLayout, form } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          this.props.onStepFormFirst(values);
          store.dispatch(push('/form/step/second'));
        }
      });
    };
    return (
      <div>
        <Form layout="horizontal" className="stepForm" hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label="付款账户"
          >
            {getFieldDecorator('payAccount', {
              initialValue: 'ant-design@alipay.com',
              rules: [{ required: true, message: '请选择付款账户' }]
            })(
              <Select placeholder="test@example.com">
                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="收款账户"
          >
            <Input.Group compact>
              <Select defaultValue="alipay" style={{ width: 80 }}>
                <Option value="alipay">支付宝</Option>
                <Option value="bank">银行账户</Option>
              </Select>
              {getFieldDecorator('receiverAccount', {
                initialValue: 'test@example.com',
                rules: [
                  { required: true, message: '请输入收款人账户' },
                  { type: 'email', message: '账户名应为邮箱格式' }
                ]
              })(
                <Input style={{ width: 'calc(100% - 80px)' }} placeholder="test@example.com" />
              )}
            </Input.Group>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="收款人姓名"
          >
            {getFieldDecorator('receiverName', {
              initialValue: 'Alex',
              rules: [{ required: true, message: '请输入收款人姓名' }]
            })(
              <Input placeholder="请输入收款人姓名" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="转账金额"
          >
            {getFieldDecorator('amount', {
              initialValue: '500',
              rules: [
                { required: true, message: '请输入转账金额' },
                { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' }
              ]
            })(
              <Input prefix="￥" placeholder="请输入金额" />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span }
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <hr />
        <div className="desc">
          <h3>说明</h3>
          <h4>转账到支付宝账户</h4>
          <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
          <h4>转账到银行卡</h4>
          <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        </div>
      </div>
    );
  }
}
