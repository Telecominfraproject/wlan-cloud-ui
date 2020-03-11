import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch } from 'react-router-dom';

import 'styles/antd.less';
import 'styles/index.scss';

import Dashboard from 'containers/Dashboard';

import RouteWithLayout from './components/RouteWithLayout';

const App = () => (
  <>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <RouteWithLayout exact path="/" component={Dashboard} />
    </Switch>
  </>
);

export default App;
