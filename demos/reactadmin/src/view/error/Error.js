import { Button } from 'antd';
import React, { createElement } from 'react';
import './Error.less';
import config from './errorConfig';

export default ({ linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  return (
    <div className="exception" {...rest}>
      <div className="imgBlock">
        <div
          className="imgEle"
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className="content">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          {
            actions ||
            createElement(linkElement, {
              to: '/',
              href: '/'
            }, <Button type="primary">返回首页</Button>)
          }
        </div>
      </div>
    </div>
  );
};
