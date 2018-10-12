import { Button, Card } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { store } from '../../../common';
import { Result } from '../../../component';
import { advancedSelector } from '../redux/selectors';
import './style.less';

class FormResult extends React.PureComponent {
  onFinish = () => {
    store.dispatch(push('/form/advanced'));
  };

  render() {
    const { formview } = this.props;
    let data;
    let time;
    if (formview) {
      data = formview.advanced.data;
      if (data.dateRange) {
        time = `${moment(data.dateRange[0]).format('YYYY-MM-DD')} ~ ${moment(data.dateRange[1]).format('YYYY-MM-DD')}`;
      }
    }
    const information = (
      <div className="information">
        <p>姓名：{data.name}</p>
        <p>仓库域名：{data.url}</p>
        <p>仓库管理员：{data.owner}</p>
        <p>审批人：{data.approver}</p>
        <p> 审批日期：{time}</p>
        <p>仓库类型：{data.type}</p>
        <p>...</p>
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
      <Card>
        <Result
          type="success"
          title="操作成功"
          extra={information}
          actions={actions}
          className="result"
        />
      </Card>
    );
  }
}
function mapStateToProps(state) {
  return {
    formview: {
      advanced: advancedSelector(state)
    }
  };
}
export default withRouter(connect(mapStateToProps)(FormResult));
