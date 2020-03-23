import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { AppLayout as Layout } from 'cu-ui';

import logo from 'images/logo-light.png';
import logoMobile from 'images/logoxmobile.jpg';

const MasterLayout = ({ children }) => {
  const location = useLocation();
  return (
    <Layout company="ConnectUs" logo={logo} logoMobile={logoMobile} onLogout={() => {}} locationState={location}>
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
