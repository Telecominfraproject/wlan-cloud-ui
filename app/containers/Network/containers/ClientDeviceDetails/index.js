import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Alert, notification } from 'antd';
import {
  Loading,
  ClientDeviceDetails as ClientDevicesDetailsPage,
} from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION, FILTER_SERVICE_METRICS } from 'graphql/queries';

const ClientDeviceDetails = () => {
  const toTime = moment();
  const fromTime = toTime.subtract(24, 'hours');

  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
  });
  const {
    loading: metricsLoading,
    error: metricsError,
    data: metricsData,
    refetch: metricsRefetch,
  } = useQuery(FILTER_SERVICE_METRICS, {
    variables: {
      customerId,
      fromTime: fromTime.unix(),
      toTime: toTime.unix(),
      clientMacs: [id],
      dataTypes: ['Client'],
    },
  });

  const handleOnRefresh = () => {
    metricsRefetch();
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

  return (
    <ClientDevicesDetailsPage
      data={data.getClientSession[0]}
      onRefresh={handleOnRefresh}
      metricsLoading={metricsLoading}
      metricsError={metricsError}
      metricsData={
        metricsData && metricsData.filterServiceMetrics && metricsData.filterServiceMetrics.items
      }
      historyDate={toTime}
    />
  );
};

export default ClientDeviceDetails;
