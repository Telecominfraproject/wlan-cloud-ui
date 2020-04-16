import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

import { Login as LoginPage } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';

import { setItem } from 'utils/localStorage';

const AUTHENTICATE_USER = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

const Login = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [authenticateUser] = useMutation(AUTHENTICATE_USER);

  const handleLogin = (email, password) => {
    authenticateUser({ variables: { email, password } })
      .then(({ data }) => {
        client.resetStore();
        setItem(AUTH_TOKEN, data.authenticateUser, data.authenticateUser.expires_in);
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
