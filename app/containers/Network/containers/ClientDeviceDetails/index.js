import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import {
  Loading,
  ClientDeviceDetails as ClientDevicesDetails,
} from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION } from 'graphql/queries';

const ClientDeviceDetails = () => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
  });

  const handleOnRefresh = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Successfully reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Could not be reloaded.',
        })
      );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Client Device." type="error" showIcon />
    );
  }

  return <ClientDevicesDetails data={data.getClientSession[0]} onRefresh={handleOnRefresh} />;
};

export default ClientDeviceDetails;
