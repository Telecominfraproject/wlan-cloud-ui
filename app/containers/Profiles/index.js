import React, { useContext, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import { Alert, notification } from 'antd';
import { Profile as ProfilePage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { GET_ALL_PROFILES } from 'graphql/queries';
import UserContext from 'contexts/UserContext';

const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const Profiles = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_ALL_PROFILES(`equipmentCount`),
    {
      variables: { customerId },
    }
  );
  const [deleteProfile] = useMutation(DELETE_PROFILE);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.refetch) {
      refetch();
    }
  }, []);

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
        variables: { context: { ...data.getAllProfiles.context } },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getAllProfiles;
          const newItems = fetchMoreResult.getAllProfiles.items;

          return {
            getAllProfiles: {
              context: { ...fetchMoreResult.getAllProfiles.context },
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
        refetch();
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
      isLastPage={data?.getAllProfiles?.context?.lastPage}
      onDeleteProfile={handleDeleteProfile}
      onLoadMore={handleLoadMore}
    />
  );
};

export default Profiles;
