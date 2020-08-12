import React, { useContext } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { notification, Alert } from 'antd';
import { EditAccount as EditAccountPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_USER } from 'graphql/queries';
import { UPDATE_USER } from 'graphql/mutations';

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
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load User." type="error" showIcon />;
  }

  return <EditAccountPage onSubmit={handleSubmit} email={email} />;
};

export default EditAccount;
