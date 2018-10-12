import { Button, Col, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import { push } from 'react-router-redux';
import { store } from '../../../common';
import { Result } from '../../../component';
import './style.less';

export default class Step3 extends React.PureComponent {
  componentWillMount() {
    const { formview } = this.props;
    if (_.isEmpty(formview.step.firstData) || _.isEmpty(formview.step.secondData)) {
      this.onFinish();
    }
  }

  onFinish = () => {
    store.dispatch(push('/form/step'));
  };

  render() {
    const { formview } = this.props;
    const information = (
      <div className="information">
        <Row>
          <Col span={8} className="label">付款账户：</Col>
          <Col span={16}>{formview.step.firstData.payAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className="label">收款账户：</Col>
          <Col span={16}>{formview.step.firstData.receiverAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className="label">收款人姓名：</Col>
          <Col span={16}>{formview.step.firstData.receiverName}</Col>
        </Row>
        <Row>
          <Col span={8} className="label">转账金额：</Col>
          <Col span={16}><span className="money">{formview.step.firstData.amount}</span> 元</Col>
        </Row>
      </div>
    );
    const actions = (
      <div>
        <Button type="primary" onClick={this.onFinish}>
          再转一笔
        </Button>
        <Button>
          查看账单
        </Button>
      </div>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="预计两小时内到账"
        extra={information}
        actions={actions}
        className="result"
      />
    );
  }
}
