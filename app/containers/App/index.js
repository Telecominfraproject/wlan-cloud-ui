import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect } from 'react-router-dom';

import { ThemeProvider, GenericNotFound } from '@tip-wlan/wlan-cloud-ui-library';

import logo from 'images/tip-logo.png';
import logoMobile from 'images/tip-logo-mobile.png';

import { AUTH_TOKEN, COMPANY, ROUTES, USER_FRIENDLY_RADIOS } from 'constants/index';
import Login from 'containers/Login';

import Network from 'containers/Network';
import Dashboard from 'containers/Dashboard';
import Profiles from 'containers/Profiles';
import System from 'containers/System';

import AddProfile from 'containers/AddProfile';
import ProfileDetails from 'containers/ProfileDetails';

import Alarms from 'containers/Alarms';
import EditAccount from 'containers/EditAccount';
import Accounts from 'containers/Accounts';
import UserProvider from 'contexts/UserProvider';

import { getItem, setItem } from 'utils/localStorage';
import { parseJwt } from 'utils/jwt';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import ProtectedRouteWithLayout from './components/ProtectedRouteWithLayout';

const RedirectToDashboard = () => (
  <Redirect
    to={{
      pathname: ROUTES.dashboard,
    }}
  />
);

const App = () => {
  const token = getItem(AUTH_TOKEN);
  let initialUser = {};
  if (token) {
    const { userId, userName, userRole, customerId } = parseJwt(token.access_token);
    initialUser = { id: userId, email: userName, roles: userRole, customerId };
  }
  const [user, setUser] = useState(initialUser);

  const updateToken = newToken => {
    setItem(AUTH_TOKEN, newToken);
    if (newToken) {
      const { userId, userName, userRole, customerId } = parseJwt(newToken.access_token);
      setUser({ id: userId, email: userName, roles: userRole, customerId });
    }
  };

  const updateUser = newUser => setUser({ ...user, ...newUser });

  return (
    <UserProvider
      id={user.id}
      email={user.email}
      roles={user.roles}
      customerId={user.customerId}
      updateUser={updateUser}
      updateToken={updateToken}
    >
      <ThemeProvider
        company={COMPANY}
        logo={logo}
        logoMobile={logoMobile}
        routes={ROUTES}
        radioTypes={USER_FRIENDLY_RADIOS}
      >
        <Helmet titleTemplate={`%s - ${COMPANY}`} defaultTitle={COMPANY}>
          <meta name="description" content={COMPANY} />
        </Helmet>

        <Switch>
          <UnauthenticatedRoute exact path={ROUTES.login} component={Login} />
          <ProtectedRouteWithLayout exact path={ROUTES.root} component={RedirectToDashboard} />
          <ProtectedRouteWithLayout exact path={ROUTES.dashboard} component={Dashboard} />
          <ProtectedRouteWithLayout path={ROUTES.network} component={Network} />
          <ProtectedRouteWithLayout path={ROUTES.system} component={System} />

          <ProtectedRouteWithLayout exact path={ROUTES.profiles} component={Profiles} />
          <ProtectedRouteWithLayout
            exact
            path={`${ROUTES.profiles}/:id`}
            component={ProfileDetails}
          />
          <ProtectedRouteWithLayout exact path={ROUTES.addprofile} component={AddProfile} />

          <ProtectedRouteWithLayout exact path={ROUTES.alarms} component={Alarms} />
          {user?.id !== 0 && (
            <ProtectedRouteWithLayout exact path={ROUTES.account} component={EditAccount} />
          )}
          {user?.roles?.[0] === 'SuperUser' && (
            <ProtectedRouteWithLayout exact path={ROUTES.users} component={Accounts} />
          )}
          <ProtectedRouteWithLayout component={GenericNotFound} />
        </Switch>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
