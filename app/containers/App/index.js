import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import { Login, Dashboard } from 'cu-ui';

import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const App = () => (
  <>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRouteWithLayout exact path="/" component={Dashboard} />
    </Switch>
  </>
);

export default App;
