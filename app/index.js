import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import 'styles/antd.less';
import 'styles/index.scss';

import App from 'containers/App';
import configureStore from 'store';
import history from 'utils/history';

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  );
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('containers/App', () => ReactDOM.unmountComponentAtNode(MOUNT_NODE));
}

render();
