import React, { useContext } from 'react';
import { useMutation, useApolloClient, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

import { Login as LoginPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';

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
  const { updateToken } = useContext(UserContext);
  const client = useApolloClient();
  const [authenticateUser] = useMutation(AUTHENTICATE_USER);

  const handleLogin = (email, password) => {
    authenticateUser({ variables: { email, password } })
      .then(({ data }) => {
        client.resetStore()
          .then(() => {
            updateToken(data.authenticateUser);
            history.push('/');
          });
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
