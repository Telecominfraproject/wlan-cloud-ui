import React, { useContext } from 'react';
import { EditAccount as EditAccountPage } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { notification } from 'antd';

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!
    $username: String!
    $password: String!
    $role: String!
    $customerId: Int!
    $lastModifiedTimestamp: String!
  ) {
    updateUser(
      id: $id
      username: $username
      password: $password
      role: $role
      customerId: $customerId
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      User
    }
  }
`;

const EditAccount = () => {
  const { id, email, role, customerID } = useContext(UserContext);
  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = newPassword => {
    const username = email;
    const password = newPassword;
    const lastModifiedTimestamp = new Date().getTime.toString;

    updateUser({ variables: { id, username, password, role, customerID, lastModifiedTimestamp } })
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
