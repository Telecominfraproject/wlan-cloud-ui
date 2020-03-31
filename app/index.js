import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import 'styles/antd.less';
import 'styles/index.scss';

import App from 'containers/App';
import { AUTH_TOKEN } from 'constants/index';

const MOUNT_NODE = document.getElementById('root');

const client = new ApolloClient({
  // uri: ""
  request: operation => {
    const token = localStorage.getItem(AUTH_TOKEN);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>,
    MOUNT_NODE
  );
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('containers/App', () => ReactDOM.unmountComponentAtNode(MOUNT_NODE));
}

render();
