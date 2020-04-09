import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { Login as LoginPage } from 'wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';

import { setItem } from 'utils/localStorage';

const AUTHENTICATE_USER = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const client = useApolloClient();
  const [authenticateUser] = useMutation(AUTHENTICATE_USER);

  const handleLogin = (email, password) => {
    authenticateUser({ variables: { email, password } }).then(({ data }) => {
      client.resetStore();
      setItem(AUTH_TOKEN, data.authenticateUser.token, data.authenticateUser.token.expires_in);
    });
  };

  return <LoginPage onLogin={handleLogin} />;
};

export default Login;
