import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink, Observable } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';

import 'styles/antd.less';
import 'styles/index.scss';

import App from 'containers/App';
import { AUTH_TOKEN } from 'constants/index';
import { REFRESH_TOKEN } from 'graphql/mutations';
import { getItem, setItem, removeItem } from 'utils/localStorage';
import history from 'utils/history';

const API_URI =
  process.env.NODE_ENV === 'development'
    ? 'https://wlan-graphql.zone3.lab.connectus.ai/'
    : window.REACT_APP_API;
const MOUNT_NODE = document.getElementById('root');

const cache = new InMemoryCache();

const uploadLink = createUploadLink({
  uri: API_URI,
});

const request = async operation => {
  const token = getItem(AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token.access_token}` : '',
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, operation, forward }) => {
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
                history.push('/login');
              }
              return forward(operation);
            default:
              return forward(operation);
          }
        });
      }
    }),
    requestLink,
    uploadLink,
  ]),
  cache,
});

const render = () => {
  ReactDOM.render(
    <Router history={history}>
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
