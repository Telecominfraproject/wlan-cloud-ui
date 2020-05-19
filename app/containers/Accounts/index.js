import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';

import { Accounts as AccountsPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

const GET_ALL_USERS = gql`
  query GetAllUsers($customerId: Int!) {
    getAllUsers(customerId: $customerId) {
      items {
        id
        username
        role
        lastModifiedTimestamp
        customerId
      }
    }
  }
`;

const DELETE_USER = gql`
  query DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
      username
      role
      customerId
      lastModifiedTimestamp
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

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $role: String!, $customerId: Int!) {
    createUser(username: $username, password: $password, role: $role, customerId: $customerId) {
      username
      role
      customerId
    }
  }
`;

const Accounts = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS, { variables: { customerId } });

  const [DeleteUser] = useLazyQuery(DELETE_USER, {
    onCompleted: () => {
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

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);

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

  const handleDeleteUser = id => {
    DeleteUser({ variables: { id } });
    refetch();
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

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load Users." type="error" showIcon />;
  }

  return (
    <AccountsPage
      data={data.getAllUsers.items}
      onCreateUser={handleCreateUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
    />
  );
};
export default Accounts;