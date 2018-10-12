import { Alert, Card, Col, Row } from 'antd';
import React from 'react';

class AlertView extends React.PureComponent {
  render() {
    return (
      <div>
        <Card title="顶部公告">
          <Alert message="Warning text" banner />
          <br />
          <Alert message="Very long warning text warning text text text text text text text" banner closable />
          <br />
          <Alert showIcon={false} message="Warning text without icon" banner />
          <br />
          <Alert type="error" message="Error text" banner />
        </Card>
        <Row gutter={16}>
          <Col xs={12}>
            <Card title="图标">
              <Alert message="Success Tips" type="success" showIcon />
              <Alert message="Informational Notes" type="info" showIcon />
              <Alert message="Warning" type="warning" showIcon />
              <Alert message="Error" type="error" showIcon />
              <Alert
                message="success tips"
                description="Detailed description and advices about successful copywriting."
                type="success"
                showIcon
              />
              <Alert
                message="Informational Notes"
                description="Additional description and informations about copywriting."
                type="info"
                showIcon
              />
              <Alert
                message="Warning"
                description="This is a warning notice about copywriting."
                type="warning"
                showIcon
              />
              <Alert
                message="Error"
                description="This is an error message about copywriting."
                type="error"
                showIcon
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="含有辅助性文字介绍">
              <Alert
                message="Success Text"
                description="Success Description Success Description Success Description"
                type="success"
                closeText="Close Now"
              />
              <Alert
                message="Info Text"
                description="Info Description Info Description Info Description Info Description"
                type="info"
                closeText="Close Now"
              />
              <Alert
                message="Warning Text"
                description="Warning Description Warning Description Warning Description Warning Description"
                type="warning"
                closeText="Close Now"
              />
              <Alert
                message="Error Text"
                description="Error Description Error Description Error Description Error Description"
                type="error"
                closeText="Close Now"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default AlertView;
