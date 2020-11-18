import React, { useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { Alert, notification } from 'antd';
import {
  Loading,
  ClientDeviceDetails as ClientDevicesDetailsPage,
} from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION, FILTER_SERVICE_METRICS } from 'graphql/queries';

const toTime = moment();
const fromTime = moment().subtract(4, 'hours');

const ClientDeviceDetails = () => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
    errorPolicy: 'all',
  });
  const {
    loading: metricsLoading,
    error: metricsError,
    data: metricsData,
    refetch: metricsRefetch,
  } = useQuery(FILTER_SERVICE_METRICS, {
    variables: {
      customerId,
      fromTime: fromTime.valueOf().toString(),
      toTime: toTime.valueOf().toString(),
      clientMacs: [id],
      dataTypes: ['Client'],
      limit: 1000,
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

  if (error && !data?.getClientSession) {
    if (error.message === '403: Forbidden' || error.message === '401: Unauthorized') {
      return <Redirect to="/login" />;
    }

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
      historyDate={{ toTime, fromTime }}
    />
  );
};

export default ClientDeviceDetails;
