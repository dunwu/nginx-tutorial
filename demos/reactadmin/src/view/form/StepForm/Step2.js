import { Alert, Button, Form, Input } from 'antd';
import _ from 'lodash';
import React from 'react';
import { push } from 'react-router-redux';
import { store } from '../../../common';
import { number } from '../../../util';
import './style.less';

export default class Step2 extends React.PureComponent {
  componentWillMount() {
    const { formview } = this.props;
    if (_.isEmpty(formview.step.firstData)) {
      this.onPrev();
    }
  }

  onPrev = () => {
    store.dispatch(push('/form/step'));
  };

  onNext = () => {
    store.dispatch(push('/form/step/third'));
  };

  render() {
    const { formItemLayout, form, formview } = this.props;
    const { getFieldDecorator } = form;
    const onValidateForm = (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          this.props.onStepFormSecond(values);
          const submitData = _.merge(formview.step.firstData, formview.step.secondData);
          this.props.onStepFormSubmit(submitData);
          this.onNext();
        }
      });
    };
    return (
      <Form layout="horizontal" className="stepForm">
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{ marginBottom: 24 }}
        />
        <Form.Item
          {...formItemLayout}
          className="stepFormText"
          label="付款账户"
        >
          {formview.step.firstData.payAccount}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className="stepFormText"
          label="收款账户"
        >
          {formview.step.firstData.receiverAccount}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className="stepFormText"
          label="收款人姓名"
        >
          {formview.step.firstData.receiverName}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className="stepFormText"
          label="转账金额"
        >
          <span className="money">{formview.step.firstData.amount}</span>
          <span className="uppercase">（{number.digitUppercase(formview.step.firstData.amount)}）</span>
        </Form.Item>
        <hr />
        <br />
        <Form.Item
          {...formItemLayout}
          label="支付密码"
          required={false}
        >
          {getFieldDecorator('password', {
            initialValue: '123456',
            rules: [{
              required: true, message: '需要支付密码才能进行支付'
            }]
          })(
            <Input type="password" autoComplete="off" style={{ width: '80%' }} />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span }
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={this.props.submitting}>
            提交
          </Button>
          <Button onClick={this.onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
