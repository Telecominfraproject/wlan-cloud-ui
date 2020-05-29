import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import { Alert, Spin, notification } from 'antd';

import { Profile as ProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';

const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: Int!, $cursor: String) {
    getAllProfiles(customerId: $customerId, cursor: $cursor) {
      items {
        id
        name
        profileType
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

const DELETE_PROFILE = gql`
  query DeleteProfile($id: Int!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const Profiles = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_ALL_PROFILES, {
    variables: { customerId },
  });

  const [deleteProfile] = useLazyQuery(DELETE_PROFILE, {
    onCompleted: () => {
      refetch();
      notification.success({
        message: 'Success',
        description: 'Account successfully deleted.',
      });
    },
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'Account could not be deleted.',
      });
    },
  });

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
    deleteProfile({ variables: { id } });
  };
  if (loading) {
    return <Spin size="large" />;
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
