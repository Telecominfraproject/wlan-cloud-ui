import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { NetworkTable, Loading } from '@tip-wlan/wlan-cloud-ui-library';

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
  { title: 'BAND', dataIndex: 'radioType' },
  { title: 'SIGNAL', dataIndex: 'signal' },
  { title: 'STATUS', dataIndex: 'status' },
];

const ClientDevices = ({ checkedLocations }) => {
  const { customerId } = useContext(UserContext);
  const [filterClientSessions, { loading, error, data, fetchMore }] = useLazyQuery(
    FILTER_CLIENT_SESSIONS,
    {
      errorPolicy: 'all',
    }
  );

  const handleLoadMore = () => {
    if (!data.filterClientSessions.context.lastPage) {
      fetchMore({
        variables: { cursor: data.filterClientSessions.context.cursor },
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

  useEffect(() => {
    fetchFilterClientSessions();
  }, [checkedLocations]);

  if (loading) {
    return <Loading />;
  }

  if (error && !data?.filterClientSessions?.items) {
    return (
      <Alert message="Error" description="Failed to load client devices." type="error" showIcon />
    );
  }

  return (
    <NetworkTable
      tableColumns={clientDevicesTableColumns}
      tableData={data && data.filterClientSessions && data.filterClientSessions.items}
      onLoadMore={handleLoadMore}
      isLastPage={data && data.filterClientSessions && data.filterClientSessions.context.lastPage}
    />
  );
};

ClientDevices.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default ClientDevices;
