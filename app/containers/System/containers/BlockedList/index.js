import React, { useContext } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import { BlockedList as BlockedListPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { GET_BLOCKED_CLIENTS, GET_CLIENTS } from 'graphql/queries';
import { UPDATE_CLIENT } from 'graphql/mutations';
import UserContext from 'contexts/UserContext';

const BlockedList = () => {
  const { customerId } = useContext(UserContext);
  const { data, error, loading, refetch } = useQuery(GET_BLOCKED_CLIENTS, {
    variables: { customerId },
  });
  const [updateClient] = useMutation(UPDATE_CLIENT);

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
          description: 'Client Blocked List settings successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Client Blocked List settings could not be updated.',
        })
      );
  };

  const [getClients, { variables }] = useLazyQuery(GET_CLIENTS, {
    onCompleted: resp => {
      if (resp.getClients.length) {
        const client = { ...resp.getClients[0] };

        const hasDetailsProperty = Object.prototype.hasOwnProperty.call(
          client.details,
          'blocklistDetails'
        );

        if (hasDetailsProperty) {
          client.details.blocklistDetails.enabled = true;
          handleUpdateClient(client.macAddress, client.details);
        }
      } else {
        const details = {
          blocklistDetails: { enabled: true },
          model_type: 'ClientInfoDetails',
        };
        handleUpdateClient(variables.macAddress[0], details);
      }
    },
  });

  const handleAddClient = macAddress => {
    getClients({
      variables: {
        customerId,
        macAddress: [macAddress],
      },
    });
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <Alert message="Error" description="Failed to load Client Data." type="error" showIcon />
    );

  return (
    <BlockedListPage
      data={data && data.getBlockedClients}
      onUpdateClient={handleUpdateClient}
      onAddClient={handleAddClient}
    />
  );
};

export default BlockedList;
