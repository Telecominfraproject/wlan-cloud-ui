import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';

import { Accounts as AccountsPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

const GET_ALL_USERS = gql`
  query GetAllUsers($customerId: Int!, $cursor: String) {
    getAllUsers(customerId: $customerId, cursor: $cursor) {
      items {
        id
        email: username
        role
        lastModifiedTimestamp
        customerId
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $role: String!, $customerId: Int!) {
    createUser(username: $username, password: $password, role: $role, customerId: $customerId) {
      username
      role
      customerId
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!
    $username: String!
    $password: String!
    $role: String!
    $customerId: Int!
    $lastModifiedTimestamp: String
  ) {
    updateUser(
      id: $id
      username: $username
      password: $password
      role: $role
      customerId: $customerId
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      username
      role
      customerId
      lastModifiedTimestamp
    }
  }
`;

const DELETE_USER = gql`
  query DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const Accounts = () => {
  const { customerId } = useContext(UserContext);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_ALL_USERS, {
    variables: { customerId },
  });
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useLazyQuery(DELETE_USER, {
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
    deleteUser({ variables: { id } });
  };

  if (loading) {
    return <Spin size="large" />;
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
