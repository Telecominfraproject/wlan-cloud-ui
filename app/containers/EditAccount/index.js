import React, { useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { notification } from 'antd';
import { EditAccount as EditAccountPage } from '@tip-wlan/wlan-cloud-ui-library';
import { withQuery } from 'containers/QueryWrapper';

import UserContext from 'contexts/UserContext';

const GET_USER = gql`
  query GetUser($id: ID!) {
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
    $id: ID!
    $username: String!
    $password: String!
    $role: String!
    $customerId: ID!
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

const EditAccount = withQuery(
  ({ data }) => {
    const { id, email } = useContext(UserContext);
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

    return <EditAccountPage onSubmit={handleSubmit} email={email} />;
  },
  GET_USER,
  () => {
    const { id } = useContext(UserContext);
    return { id };
  }
);

export default EditAccount;
