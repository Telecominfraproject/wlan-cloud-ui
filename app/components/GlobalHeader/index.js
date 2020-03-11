import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout, Icon, Popover, Row } from 'antd';

import logoMobile from 'images/logoxmobile.jpg';

const { Header } = Layout;

const GlobalHeader = ({ collapsed, onMenuButtonClick, isMobile }) => {
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
        <Link onClick={hidePopover} to="/accounts/customers/view">
          Profile
        </Link>
      </Row>
      <Row>
        <Link onClick={hidePopover} to="/account">
          Users
        </Link>
      </Row>
      <Row>
        <Link onClick={hidePopover} to="/accounts">
          Advanced
        </Link>
      </Row>
      <Row>
        <Link onClick={hidePopover} to="/accounts/customersxw">
          Rules Preference
        </Link>
      </Row>
    </>
  );

  return (
    <Header collapsed={collapsed} isMobile={isMobile}>
      {isMobile && [
        <Link to="/" key="mobileLogo">
          <img src={logoMobile} alt="logo" width="32" />
        </Link>,
      ]}
      <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={onMenuButtonClick} />
      <Popover
        content={userOptions}
        trigger="click"
        getPopupContainer={e => e.parentElement}
        visible={popoverVisible}
        onVisibleChange={handleVisibleChange}
      >
        <Icon type="setting" />
      </Popover>
    </Header>
  );
};

GlobalHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onMenuButtonClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default GlobalHeader;
