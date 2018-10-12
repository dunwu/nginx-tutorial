import { Card, Form, Steps } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { onStepFormFirst, onStepFormSecond, onStepFormSubmit } from '../redux/actions';
import { stepSelector } from '../redux/selectors';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import './style.less';

const { Step } = Steps;

class StepForm extends React.PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
    case 'step':
      return 0;
    case 'second':
      return 1;
    case 'third':
      return 2;
    default:
      return 0;
    }
  }

  getCurrentComponent() {
    const componentMap = {
      0: Step1,
      1: Step2,
      2: Step3
    };
    return componentMap[this.getCurrentStep()];
  }

  render() {
    const { form, formview } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const CurrentComponent = this.getCurrentComponent();
    return (
      <Card bordered={false}>
        <div>
          <Steps current={this.getCurrentStep()} className="steps">
            <Step title="填写转账信息" />
            <Step title="确认转账信息" />
            <Step title="完成" />
          </Steps>
          <CurrentComponent
            {...this.props}
            formItemLayout={formItemLayout}
            form={form}
            data={formview.step}
          />
        </div>
      </Card>
    );
  }
}
function mapStateToProps(state) {
  return {
    formview: {
      step: stepSelector(state)
    }
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onStepFormSubmit: bindActionCreators(onStepFormSubmit, dispatch),
    onStepFormFirst: bindActionCreators(onStepFormFirst, dispatch),
    onStepFormSecond: bindActionCreators(onStepFormSecond, dispatch)
  };
}
const WrappedStepForm = Form.create()(StepForm);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedStepForm));
