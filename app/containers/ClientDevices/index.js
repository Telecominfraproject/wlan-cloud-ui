import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { notification, Spin } from 'antd';

import { ClientDevices as ClientDevicesPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($customerId: Int!) {
    getAllLocations(customerId: $customerId) {
      id
      name
      parentId
    }
  }
`;

const ClientDevices = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_LOCATIONS, { variables: { customerId } });

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load Locations',
    });
  }

  return <ClientDevicesPage locations={data && data.getAllLocations} />;
};

export default ClientDevices;
