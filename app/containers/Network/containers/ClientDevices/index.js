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
  { title: 'OS/MODEL/MFR', dataIndex: 'osModelMfr' },
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
  const [getAllClientSessions, { loading, error, data, fetchMore }] = useLazyQuery(
    FILTER_CLIENT_SESSIONS
  );

  const handleLoadMore = () => {
    if (!data.getAllClientSessions.context.lastPage) {
      fetchMore({
        variables: { cursor: data.getAllClientSessions.context.cursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getAllClientSessions;
          const newItems = fetchMoreResult.getAllClientSessions.items;

          return {
            getAllClientSessions: {
              context: fetchMoreResult.getAllClientSessions.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  useEffect(() => {
    getAllClientSessions({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
  }, [checkedLocations]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load client devices." type="error" showIcon />
    );
  }

  return (
    <NetworkTable
      tableColumns={clientDevicesTableColumns}
      tableData={data && data.getAllClientSessions && data.getAllClientSessions.items}
      onLoadMore={handleLoadMore}
      isLastPage={data && data.getAllClientSessions && data.getAllClientSessions.context.lastPage}
    />
  );
};

ClientDevices.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default ClientDevices;
