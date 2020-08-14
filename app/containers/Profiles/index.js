import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Alert, notification } from 'antd';

import { Profile as ProfilePage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';
import { DELETE_PROFILE } from 'graphql/mutations';

export const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: ID!, $cursor: String, $limit: Int) {
    getAllProfiles(customerId: $customerId, cursor: $cursor, limit: $limit) {
      items {
        id
        name
        profileType
        details
        equipmentCount
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

const Profiles = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_ALL_PROFILES, {
    variables: { customerId, limit: 100 },
  });
  const [deleteProfile] = useMutation(DELETE_PROFILE);

  const reloadTable = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profiles reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profiles could not be reloaded.',
        })
      );
  };

  const handleLoadMore = () => {
    if (!data.getAllProfiles.context.lastPage) {
      fetchMore({
        variables: { cursor: data.getAllProfiles.context.cursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getAllProfiles;
          const newItems = fetchMoreResult.getAllProfiles.items;

          return {
            getAllProfiles: {
              context: fetchMoreResult.getAllProfiles.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  const handleDeleteProfile = id => {
    deleteProfile({ variables: { id } })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be deleted.',
        })
      );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load profiles." type="error" showIcon />;
  }

  return (
    <ProfilePage
      data={data.getAllProfiles.items}
      onReload={reloadTable}
      isLastPage={data.getAllProfiles.context.lastPage}
      onDeleteProfile={handleDeleteProfile}
      onLoadMore={handleLoadMore}
    />
  );
};

export default Profiles;
