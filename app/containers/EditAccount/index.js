import React, { useContext } from 'react';
import { EditAccount as EditAccountPage } from '@tip-wlan/wlan-cloud-ui-library';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { notification, Spin, Alert } from 'antd';

import UserContext from 'contexts/UserContext';

const GET_USER = gql`
  query GetUser($id: Int!) {
    getUser(id: $id) {
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

const EditAccount = () => {
  const { id, email } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_USER, { variables: { id } });
  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = newPassword => {
    const { role, customerId, lastModifiedTimestamp } = data.getUser;

    updateUser({
      variables: {
        id,
        username: email,
        password: newPassword,
        role,
        customerId,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Password successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Password could not be updated.',
        })
      );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load User." type="error" showIcon />;
  }

  return <EditAccountPage onSubmit={handleSubmit} email={email} />;
};

export default EditAccount;
