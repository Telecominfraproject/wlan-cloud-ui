import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, notification } from 'antd';
import { BlockedList as BlockedListPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { GET_BLOCKED_CLIENTS } from 'graphql/queries';
import { UPDATE_CLIENT, ADD_BLOCKED_CLIENT } from 'graphql/mutations';
import { Redirect } from 'react-router-dom';
import UserContext from 'contexts/UserContext';

const BlockedList = () => {
  const { customerId } = useContext(UserContext);
  const { data, error, loading, refetch } = useQuery(GET_BLOCKED_CLIENTS, {
    variables: { customerId },
  });
  const [addClient] = useMutation(ADD_BLOCKED_CLIENT);
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const handleAddClient = macAddress => {
    addClient({
      variables: {
        customerId,
        macAddress,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Client successfully added to Blocked List',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Client could not be added to Blocked List',
        })
      );
  };

  const handleUpdateClient = (macAddress, details) => {
    updateClient({
      variables: {
        customerId,
        macAddress,
        details,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Client successfully removed from Blocked List',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Client could not be removed from Blocked List',
        })
      );
  };

  if (loading) return <Loading />;

  if (error) {
    if (error.message === '403: Forbidden' || error.message === '401: Unauthorized') {
      return <Redirect to="/login" />;
    }

    return (
      <Alert message="Error" description="Failed to load Client Data." type="error" showIcon />
    );
  }

  return (
    <BlockedListPage
      data={data && data.getBlockedClients}
      onUpdateClient={handleUpdateClient}
      onAddClient={handleAddClient}
    />
  );
};

export default BlockedList;
