import React from 'react';
import { Link } from 'react-router-dom';

class Logo extends React.PureComponent {
  render() {
    return (
      <div>
        <Link className="sider-logo" to="/home">
          <img
            alt="antd.svg"
            src="http://oyz7npk35.bkt.clouddn.com/image/react-admin/react-admin-logo.ico"
          />
          <span>REACT ADMIN</span>
        </Link>
      </div>
    );
  }
}
export default Logo;
