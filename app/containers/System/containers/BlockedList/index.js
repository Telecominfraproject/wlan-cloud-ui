import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import { GET_BLOCKED_CLIENTS } from 'graphql/queries';
import { UPDATE_CLIENT } from 'graphql/mutations';
import { BlockedList as BlockedListPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
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

  if (loading) return <Loading />;

  if (error)
    return (
      <Alert message="Error" description="Failed to load Client Data." type="error" showIcon />
    );

  return (
    <BlockedListPage data={data && data.getBlockedClients} onUpdateClient={handleUpdateClient} />
  );
};

export default BlockedList;
