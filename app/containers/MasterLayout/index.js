import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import { AppLayout as Layout } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';

import { removeItem } from 'utils/localStorage';

const MasterLayout = ({ children }) => {
  const client = useApolloClient();
  const location = useLocation();

  const handleLogout = () => {
    removeItem(AUTH_TOKEN);
    client.resetStore();
  };

  return (
    <Layout onLogout={handleLogout} locationState={location}>
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
