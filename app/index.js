import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import 'styles/antd.less';
import 'styles/index.scss';

import App from 'containers/App';
import { AUTH_TOKEN } from 'constants/index';

import { getItem, setItem, removeItem } from 'utils/localStorage';

const API_URI = process.env.NODE_ENV !== 'production' ? 'http://localhost:4000/' : '';
const MOUNT_NODE = document.getElementById('root');

const REFRESH_TOKEN = gql`
  mutation UpdateToken($refreshToken: String!) {
    updateToken(refreshToken: $refreshToken) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

const client = new ApolloClient({
  uri: API_URI,
  request: operation => {
    const token = getItem(AUTH_TOKEN);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token.access_token}` : '',
      },
    });
  },
  onError: ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(err => {
        // handle errors differently based on its error code
        switch (err.extensions.code) {
          case 'FORBIDDEN':
          case 'UNAUTHENTICATED':
            operation.setContext({
              headers: {
                ...operation.getContext().headers,
                authorization: client
                  .mutate({
                    mutation: REFRESH_TOKEN,
                    variables: {
                      refreshToken: getItem(AUTH_TOKEN).refresh_token,
                    },
                  })
                  .then(({ data }) => {
                    setItem(AUTH_TOKEN, data.updateToken, data.updateToken.expires_in);
                    return data.updateToken;
                  }),
              },
            });
            return forward(operation);
          case 'INTERNAL_SERVER_ERROR':
            if (err.path && err.path[0] === 'updateToken') {
              removeItem(AUTH_TOKEN);
            }
            return forward(operation);
          default:
            return forward(operation);
        }
      });
    }
  },
});

const render = () => {
  ReactDOM.render(
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>,
    MOUNT_NODE
  );
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('containers/App', () => ReactDOM.unmountComponentAtNode(MOUNT_NODE));
}

render();
