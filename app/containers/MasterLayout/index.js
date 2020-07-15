import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import { GET_ALL_STATUS_ALARMS } from 'graphql/queries';

import { AppLayout as Layout, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';

import { removeItem } from 'utils/localStorage';

import UserContext from 'contexts/UserContext';

const MasterLayout = ({ children }) => {
  const { role, customerId } = useContext(UserContext);

  const client = useApolloClient();
  const location = useLocation();

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

  const { loading, data } = useQuery(GET_ALL_STATUS_ALARMS, {
    variables: { customerId, statusDataTypes: ['CUSTOMER_DASHBOARD'] },
  });

  if (loading) {
    return <Loading />;
  }

  const alarmsArr =
    (data &&
      data.getAllStatus &&
      data.getAllStatus.items[0] &&
      data.getAllStatus.items[0].alarmsCount &&
      data.getAllStatus.items[0].alarmsCount.totalCountsPerAlarmCodeMap) ||
    {};

  const findAlarmCount = () => {
    let totalAlarms = 0;
    if (alarmsArr) {
      Object.keys(alarmsArr).forEach(i => {
        totalAlarms += alarmsArr[i];
      });
    }
    return totalAlarms;
  };

  return (
    <Layout
      onLogout={handleLogout}
      locationState={location}
      menuItems={menuItems}
      mobileMenuItems={mobileMenuItems}
      totalAlarms={findAlarmCount()}
    >
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
