import React, { useContext, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useLocation, Redirect } from 'react-router-dom';
import { Alert, notification } from 'antd';
import { Profile as ProfilePage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { GET_ALL_PROFILES } from 'graphql/queries';
import { updateQueryGetAllProfiles } from 'graphql/functions';
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
      fetchPolicy: 'network-only',
    }
  );
  const [deleteProfile] = useMutation(DELETE_PROFILE);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.refetch) {
      refetch({
        variables: { refresh: Date.now() },
      });
    }
  }, []);

  const reloadTable = () => {
    refetch({
      variables: { refresh: Date.now() },
    })
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
        updateQuery: updateQueryGetAllProfiles,
      });
    }
  };

  const handleDeleteProfile = id => {
    deleteProfile({
      variables: { id },
      refetchQueries: [
        {
          query: GET_ALL_PROFILES(`equipmentCount`),
          variables: { customerId },
        },
      ],
    })
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
    if (error.message === '403: Forbidden' || error.message === '401: Unauthorized') {
      return <Redirect to="/login" />;
    }

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
