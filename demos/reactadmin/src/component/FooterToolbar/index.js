import React, { Component } from 'react';
import classNames from 'classnames';
import './index.less';

export default class FooterToolbar extends Component {
  render() {
    const { children, className, extra, ...restProps } = this.props;
    return (
      <div
        className={classNames(className, 'toolbar')}
        {...restProps}
      >
        <div className="left">{extra}</div>
        <div className="right">{children}</div>
      </div>
    );
  }
}
