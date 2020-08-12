import React, { useContext } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

import { Login as LoginPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { AUTHENTICATE_USER } from 'graphql/mutations';

const Login = () => {
  const history = useHistory();
  const { updateToken } = useContext(UserContext);
  const client = useApolloClient();
  const [authenticateUser] = useMutation(AUTHENTICATE_USER);

  const handleLogin = (email, password) => {
    authenticateUser({ variables: { email, password } })
      .then(({ data }) => {
        client.resetStore();
        updateToken(data.authenticateUser);
        history.push('/');
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Invalid e-mail or password.',
        })
      );
  };

  return <LoginPage onLogin={handleLogin} />;
};

export default Login;
