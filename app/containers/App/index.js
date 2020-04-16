import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch } from 'react-router-dom';

import { ThemeProvider, Dashboard } from '@tip-wlan/wlan-cloud-ui-library';

import logo from 'images/logo-light.png';
import logoMobile from 'images/logoxmobile.jpg';

import Login from 'containers/Login';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const App = () => (
  <ThemeProvider company="ConnectUs" logo={logo} logoMobile={logoMobile}>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <UnauthenticatedRoute exact path="/login" component={Login} />
      <ProtectedRouteWithLayout exact path="/" component={Dashboard} />
    </Switch>
  </ThemeProvider>
);

export default App;
