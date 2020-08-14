import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';

import { Accounts as AccountsPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { GET_ALL_USERS } from 'graphql/queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from 'graphql/mutations';
import UserContext from 'contexts/UserContext';

const Accounts = () => {
  const { customerId } = useContext(UserContext);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_ALL_USERS, {
    variables: { customerId },
  });
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleLoadMore = () => {
    if (!data.getAllUsers.context.lastPage) {
      fetchMore({
        variables: { cursor: data.getAllUsers.context.cursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getAllUsers;
          const newItems = fetchMoreResult.getAllUsers.items;

          return {
            getAllUsers: {
              context: fetchMoreResult.getAllUsers.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  const handleCreateUser = (email, password, role) => {
    createUser({
      variables: {
        username: email,
        password,
        role,
        customerId,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Account successfully created.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Account could not be created.',
        })
      );
  };

  const handleEditUser = (id, email, password, role, lastModifiedTimestamp) => {
    updateUser({
      variables: {
        id,
        username: email,
        password,
        role,
        customerId,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Account successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Account could not be updated.',
        })
      );
  };

  const handleDeleteUser = id => {
    deleteUser({ variables: { id } })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Account successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Account could not be deleted.',
        })
      );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load Users." type="error" showIcon />;
  }

  return (
    <AccountsPage
      data={data.getAllUsers.items}
      onLoadMore={handleLoadMore}
      onCreateUser={handleCreateUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      isLastPage={data.getAllUsers.context.lastPage}
    />
  );
};
export default Accounts;
