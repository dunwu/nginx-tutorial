import { Icon } from 'antd';
import React from 'react';
import './index.less';

export default function Result({
  type, title, description, extra, actions, ...restProps
}) {
  const iconMap = {
    failed: <Icon className="failed" type="close-circle" />,
    success: <Icon className="success" type="check-circle" />
  };
  return (
    <div className="result" {...restProps}>
      <div className="icon">{iconMap[type]}</div>
      <div className="title">{title}</div>
      {description && <div className="description">{description}</div>}
      {extra && <div className="extra">{extra}</div>}
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}
