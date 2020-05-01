import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect } from 'react-router-dom';

import { ThemeProvider, Dashboard, ClientDevices } from '@tip-wlan/wlan-cloud-ui-library';

import logo from 'images/logo-light.png';
import logoMobile from 'images/logoxmobile.jpg';

import Login from 'containers/Login';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const RedirectToDashboard = () => (
  <Redirect
    to={{
      pathname: '/dashboard',
    }}
  />
);

const App = () => (
  <ThemeProvider company="ConnectUs" logo={logo} logoMobile={logoMobile}>
    <Helmet titleTemplate="%s - ConnectUs" defaultTitle="ConnectUs">
      <meta name="description" content="ConnectUs" />
    </Helmet>

    <Switch>
      <UnauthenticatedRoute exact path="/login" component={Login} />
      <ProtectedRouteWithLayout exact path="/" component={RedirectToDashboard} />
      <ProtectedRouteWithLayout exact path="/dashboard" component={Dashboard} />
      <ProtectedRouteWithLayout exact path="/network/client-devices" component={ClientDevices} />
    </Switch>
  </ThemeProvider>
);

export default App;
