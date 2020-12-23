import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Popover, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

const UsersDropdown = ({ onLogout }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const hidePopover = () => {
    setPopoverVisible(false);
  };

  const handleVisibleChange = visible => {
    setPopoverVisible(visible);
  };

  const userOptions = (
    <>
      <Row>
        <Link onClick={hidePopover} to="/account">
          Account
        </Link>
      </Row>
      <Row>
        <Link onClick={onLogout} to="/">
          Log Out
        </Link>
      </Row>
    </>
  );

  return (
    <Popover
      content={userOptions}
      trigger="click"
      getPopupContainer={e => e.parentElement}
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      placement="bottomRight"
      arrowPointAtCenter
    >
      <UserOutlined className={styles.MenuIcon} />
    </Popover>
  );
};

UsersDropdown.propTypes = {
  onLogout: PropTypes.func,
};

UsersDropdown.defaultProps = {
  onLogout: () => {},
};

export default UsersDropdown;
