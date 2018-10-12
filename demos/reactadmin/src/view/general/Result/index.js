import { Card } from 'antd';
import React from 'react';
import Failed from './Failed';
import Success from './Success';

export default () => (
  <div>
    <Card noHovering bordered={false} title="成功示例">
      <Success />
    </Card>
    <Card noHovering bordered={false} title="失败示例">
      <Failed />
    </Card>
  </div>
);
