import React, { useContext } from 'react';
import { EditAccount as EditAccountPage } from '@tip-wlan/wlan-cloud-ui-library';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { notification } from 'antd';
import UserContext from 'contexts/UserContext';

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
  const { id, email, role, customerId, lastModifiedTimestamp } = useContext(UserContext);
  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = newPassword => {
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
};

export default EditAccount;
