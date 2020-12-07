import React, { useContext } from 'react';
import { gql } from '@apollo/client';
import { notification } from 'antd';
import { Alarms as AlarmsPage } from '@tip-wlan/wlan-cloud-ui-library';
import { withQuery } from 'containers/QueryWrapper';

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

const Alarms = withQuery(
  ({ data, refetch, fetchMore }) => {
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

    return (
      <AlarmsPage
        data={data.getAllAlarms.items}
        onReload={handleOnReload}
        onLoadMore={handleLoadMore}
        isLastPage={data.getAllAlarms.context.lastPage}
      />
    );
  },
  GET_ALL_ALARMS,
  () => {
    const { customerId } = useContext(UserContext);
    return { customerId, errorPolicy: 'all' };
  }
);

export default Alarms;
