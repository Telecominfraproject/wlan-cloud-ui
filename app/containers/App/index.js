import React from 'react';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Switch } from 'react-router-dom';

import 'styles/antd.less';
import 'styles/index.scss';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import reducer from './reducer';
import saga from './saga';

import RouteWithLayout from './components/RouteWithLayout';

const App = () => (
  <>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <RouteWithLayout exact path="/" component={Home} />
    </Switch>
  </>
);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(withReducer, withSaga)(App);
