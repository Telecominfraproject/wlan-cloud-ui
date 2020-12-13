import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { notification } from 'antd';

import { NetworkTableContainer } from '@tip-wlan/wlan-cloud-ui-library';

import { ROUTES, USER_FRIENDLY_RADIOS } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { FILTER_CLIENT_SESSIONS } from 'graphql/queries';

const clientDevicesTableColumns = [
  {
    title: '',
    dataIndex: 'name',
  },
  {
    title: 'MAC',
    dataIndex: 'macAddress',
  },
  { title: 'MANUFACTURER', dataIndex: 'manufacturer' },
  { title: 'IP', dataIndex: 'ipAddress' },
  { title: 'HOST NAME', dataIndex: 'hostname' },
  { title: 'ACCESS POINT', dataIndex: ['equipment', 'name'] },
  { title: 'SSID', dataIndex: 'ssid' },
  {
    title: 'BAND',
    dataIndex: 'radioType',
    render: band => USER_FRIENDLY_RADIOS[band],
  },
  { title: 'SIGNAL', dataIndex: 'signal' },
  {
    title: 'STATUS',
    dataIndex: ['details', 'associationState'],
    render: text => {
      if (text === 'Active_Data') {
        return 'Connected';
      }
      if (text === 'Disconnected') {
        return 'Disconnected';
      }
      return 'N/A';
    },
  },
];

const ClientDevices = ({ checkedLocations }) => {
  const { customerId } = useContext(UserContext);
  const [filterClientSessions, { loading, error, data, refetch, fetchMore }] = useLazyQuery(
    FILTER_CLIENT_SESSIONS,
    {
      errorPolicy: 'all',
    }
  );

  const handleLoadMore = () => {
    if (!data.filterClientSessions.context.lastPage) {
      fetchMore({
        variables: { context: data.filterClientSessions.context },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.filterClientSessions;
          const newItems = fetchMoreResult.filterClientSessions.items;

          return {
            filterClientSessions: {
              context: fetchMoreResult.filterClientSessions.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  const fetchFilterClientSessions = async () => {
    filterClientSessions({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
  };

  const handleOnRefresh = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Client devices reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Client devices could not be reloaded.',
        })
      );
  };

  useEffect(() => {
    fetchFilterClientSessions();
  }, [checkedLocations]);

  return (
    <NetworkTableContainer
      activeTab={ROUTES.clientDevices}
      tableColumns={clientDevicesTableColumns}
      tableData={data?.filterClientSessions?.items}
      onLoadMore={handleLoadMore}
      onRefresh={handleOnRefresh}
      isLastPage={data && data.filterClientSessions && data.filterClientSessions.context.lastPage}
      loading={loading}
      error={error && !data?.filterClientSessions?.items && 'Failed to load client devices.'}
    />
  );
};

ClientDevices.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default ClientDevices;
