import React, { useContext, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { notification } from 'antd';
import { Profile as ProfilePage } from '@tip-wlan/wlan-cloud-ui-library';

import { GET_ALL_PROFILES } from 'graphql/queries';
import { updateQueryGetAllProfiles } from 'graphql/functions';
import UserContext from 'contexts/UserContext';
import { withQuery } from 'containers/QueryWrapper';

const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const Profiles = withQuery(
  ({ data, fetchMore, refetch }) => {
    const [deleteProfile] = useMutation(DELETE_PROFILE);
    const { customerId } = useContext(UserContext);
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
    return (
      <ProfilePage
        data={data.getAllProfiles.items}
        onReload={reloadTable}
        isLastPage={data?.getAllProfiles?.context?.lastPage}
        onDeleteProfile={handleDeleteProfile}
        onLoadMore={handleLoadMore}
      />
    );
  },
  GET_ALL_PROFILES(`equipmentCount`),
  () => {
    const { customerId } = useContext(UserContext);
    return { customerId, fetchPolicy: 'network-only' };
  }
);

export default Profiles;
