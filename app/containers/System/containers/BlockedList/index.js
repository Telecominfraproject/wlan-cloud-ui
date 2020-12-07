import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { notification } from 'antd';
import { BlockedList as BlockedListPage } from '@tip-wlan/wlan-cloud-ui-library';
import { GET_BLOCKED_CLIENTS } from 'graphql/queries';
import { UPDATE_CLIENT, ADD_BLOCKED_CLIENT } from 'graphql/mutations';
import UserContext from 'contexts/UserContext';
import { withQuery } from 'containers/QueryWrapper';

const BlockedList = withQuery(
  ({ refetch, data }) => {
    const { customerId } = useContext(UserContext);
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

    return (
      <BlockedListPage
        data={data && data.getBlockedClients}
        onUpdateClient={handleUpdateClient}
        onAddClient={handleAddClient}
      />
    );
  },
  GET_BLOCKED_CLIENTS,
  () => {
    const { customerId } = useContext(UserContext);
    return customerId;
  }
);

export default BlockedList;
