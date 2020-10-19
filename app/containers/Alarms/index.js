import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Alert, notification } from 'antd';
import { Alarms as AlarmsPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

const GET_ALL_ALARMS = gql`
  query GetAllAlarms($customerId: ID!, $context: JSONObject) {
    getAllAlarms(customerId: $customerId, context: $context) {
      items {
        severity
        alarmCode
        details
        createdTimestamp
        equipment {
          id
          name
        }
      }
      context
    }
  }
`;

const Alarms = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_ALL_ALARMS, {
    variables: { customerId },
    errorPolicy: 'all',
  });

  const handleOnReload = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Alarms reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Alarms could not be reloaded.',
        })
      );
  };

  const handleLoadMore = () => {
    if (!data.getAllAlarms.context.lastPage) {
      fetchMore({
        variables: { context: data.getAllAlarms.context },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getAllAlarms;
          const newItems = fetchMoreResult.getAllAlarms.items;

          return {
            getAllAlarms: {
              context: fetchMoreResult.getAllAlarms.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !data?.getAllAlarms?.items) {
    return <Alert message="Error" description="Failed to load alarms." type="error" showIcon />;
  }

  return (
    <AlarmsPage
      data={data.getAllAlarms.items}
      onReload={handleOnReload}
      onLoadMore={handleLoadMore}
      isLastPage={data.getAllAlarms.context.lastPage}
    />
  );
};

export default Alarms;
