import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { AppLayout as Layout } from '@tip-wlan/wlan-cloud-ui-library';

import { GET_ALARM_COUNT } from 'graphql/queries';

import { AUTH_TOKEN, ROUTES } from 'constants/index';

import { removeItem } from 'utils/localStorage';

import UserContext from 'contexts/UserContext';

const MasterLayout = ({ children }) => {
  const { roles, customerId, email } = useContext(UserContext);

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
      path: ROUTES.dashboard,
      text: 'Dashboard',
    },
    {
      key: 'network',
      path: ROUTES.network,
      text: 'Network',
    },
    {
      key: 'profiles',
      path: ROUTES.profiles,
      text: 'Profiles',
    },
    {
      key: 'system',
      path: ROUTES.system,
      text: 'System',
    },
  ];

  const mobileMenuItems = [
    ...menuItems,
    {
      key: 'settings',
      text: 'Settings',
      children: [
        {
          key: 'editAccount',
          path: ROUTES.account,
          text: 'Account',
        },
        {
          key: 'logout',
          path: ROUTES.root,
          text: 'Log Out',
        },
      ],
    },
  ];

  if (roles?.[0] === 'SuperUser') {
    menuItems.push({
      key: 'users',
      path: ROUTES.users,
      text: 'Users',
    });
    mobileMenuItems.push({
      key: 'users',
      path: ROUTES.users,
      text: 'Users',
    });
  }

  return (
    <Layout
      onLogout={handleLogout}
      locationState={location}
      menuItems={menuItems}
      mobileMenuItems={mobileMenuItems}
      totalAlarms={data && data.getAlarmCount}
      currentUserEmail={email}
    >
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
