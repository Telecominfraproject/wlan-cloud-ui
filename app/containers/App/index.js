import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import { ThemeProvider, Login, Dashboard } from 'cu-ui';

import logo from 'images/logo-light.png';
import logoMobile from 'images/logoxmobile.jpg';

import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const App = () => (
  <ThemeProvider company="ConnectUs" logo={logo} logoMobile={logoMobile}>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRouteWithLayout exact path="/" component={Dashboard} />
    </Switch>
  </ThemeProvider>
);

export default App;
