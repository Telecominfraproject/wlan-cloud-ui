import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import 'styles/antd.less';
import 'styles/index.scss';

import App from 'containers/App';

const MOUNT_NODE = document.getElementById('root');

const client = new ApolloClient({
  // uri: "https://48p1r2roz4.sse.codesandbox.io"
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
