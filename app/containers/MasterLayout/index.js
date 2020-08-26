import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { AppLayout as Layout } from '@tip-wlan/wlan-cloud-ui-library';

import { GET_ALARM_COUNT } from 'graphql/queries';

import { AUTH_TOKEN } from 'constants/index';

import { removeItem } from 'utils/localStorage';

import UserContext from 'contexts/UserContext';

const MasterLayout = ({ children }) => {
  const { role, customerId } = useContext(UserContext);

  const client = useApolloClient();
  const location = useLocation();

  const { data } = useQuery(GET_ALARM_COUNT, {
    variables: { customerId },
  });

  const handleLogout = () => {
    removeItem(AUTH_TOKEN);
    client.resetStore();
  };

  const menuItems = [
    {
      key: 'dashboard',
      path: '/dashboard',
      text: 'Dashboard',
    },
    {
      key: 'network',
      path: '/network',
      text: 'Network',
    },
    {
      key: 'profiles',
      path: '/profiles',
      text: 'Profiles',
    },
    {
      key: 'system',
      path: '/system',
      text: 'System',
    },
  ];

  const mobileMenuItems = [
    {
      key: 'dashboard',
      path: '/dashboard',
      text: 'Dashboard',
    },
    {
      key: 'network',
      path: '/network',
      text: 'Network',
    },
    {
      key: 'profiles',
      path: '/profiles',
      text: 'Profiles',
    },
    {
      key: 'system',
      path: '/system',
      text: 'System',
    },
    {
      key: 'settings',
      text: 'Settings',
      children: [
        {
          key: 'editAccount',
          path: '/account/edit',
          text: 'Edit Account',
        },
        {
          key: 'logout',
          path: '/',
          text: 'Log Out',
        },
      ],
    },
  ];

  if (role === 'SuperUser') {
    menuItems.push({
      key: 'accounts',
      path: '/accounts',
      text: 'Accounts',
    });
    mobileMenuItems.push({
      key: 'accounts',
      path: '/accounts',
      text: 'Accounts',
    });
  }

  return (
    <Layout
      onLogout={handleLogout}
      locationState={location}
      menuItems={menuItems}
      mobileMenuItems={mobileMenuItems}
      totalAlarms={data && data.getAlarmCount}
    >
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
