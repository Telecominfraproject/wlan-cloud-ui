import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect } from 'react-router-dom';

import { ThemeProvider, Dashboard, ClientDevices } from '@tip-wlan/wlan-cloud-ui-library';
import EditAccount from 'containers/EditAccount';

import logo from 'images/tip-logo.png';
import logoMobile from 'images/tip-logo-mobile.png';

import { COMPANY } from 'constants/index';
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
  <ThemeProvider company={COMPANY} logo={logo} logoMobile={logoMobile}>
    <Helmet titleTemplate={`%s - ${COMPANY}`} defaultTitle={COMPANY}>
      <meta name="description" content={COMPANY} />
    </Helmet>

    <Switch>
      <UnauthenticatedRoute exact path="/login" component={Login} />
      <ProtectedRouteWithLayout exact path="/" component={RedirectToDashboard} />
      <ProtectedRouteWithLayout exact path="/dashboard" component={Dashboard} />
      <ProtectedRouteWithLayout exact path="/network/client-devices" component={ClientDevices} />
      <ProtectedRouteWithLayout exact path="/account/edit" component={EditAccount} />
    </Switch>
  </ThemeProvider>
);

export default App;
