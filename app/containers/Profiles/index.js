import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Alert, Spin, notification } from 'antd';

import { Profile as ProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';

const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: Int!) {
    getAllProfiles(customerId: $customerId) {
      items {
        id
        name
        profileType
      }
    }
  }
`;

const Profiles = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_ALL_PROFILES, {
    variables: { customerId },
  });

  const reloadTable = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profiles reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profiles could not be reloaded.',
        })
      );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load profiles." type="error" showIcon />;
  }
  return <ProfilePage data={data.getAllProfiles.items} onReload={reloadTable} />;
};

export default Profiles;
