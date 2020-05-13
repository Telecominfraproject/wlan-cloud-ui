import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { notification, Spin } from 'antd';

import { Accounts as AccountsPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

const GET_ALL_USERS = gql`
  query GetAllUsers($customerId: Int!) {
    getAllUsers(customerId: $customerId) {
      items {
        id
        username
        role
      }
    }
  }
`;

const Accounts = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_USERS, { variables: { customerId } });

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load users',
    });
  }

  return <AccountsPage data={data.getAllUsers.items} />;
};
export default Accounts;
