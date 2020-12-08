import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { notification } from 'antd';
import { ClientDeviceDetails as ClientDevicesDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION, FILTER_SERVICE_METRICS } from 'graphql/queries';
import { withQuery } from 'containers/QueryWrapper';

const toTime = moment();
const fromTime = moment().subtract(4, 'hours');

const ClientDeviceDetails = withQuery(
  ({ data, refetch }) => {
    const { id } = useParams();
    const { customerId } = useContext(UserContext);

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
  },
  GET_CLIENT_SESSION,
  () => {
    const { id } = useParams();
    const { customerId } = useContext(UserContext);
    return { customerId, macAddress: id, errorPolicy: 'all' };
  }
);

export default ClientDeviceDetails;
