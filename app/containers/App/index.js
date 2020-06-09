import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect } from 'react-router-dom';

import { ThemeProvider, Dashboard } from '@tip-wlan/wlan-cloud-ui-library';

import logo from 'images/tip-logo.png';
import logoMobile from 'images/tip-logo-mobile.png';

import { AUTH_TOKEN, COMPANY } from 'constants/index';
import Login from 'containers/Login';
import Network from 'containers/Network';
import Profiles from 'containers/Profiles';
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
      pathname: '/dashboard',
    }}
  />
);

const App = () => {
  const token = getItem(AUTH_TOKEN);
  let initialUser = {};
  if (token) {
    const { userId, userName, userRole, customerId } = parseJwt(token.access_token);
    initialUser = { id: userId, email: userName, role: userRole, customerId };
  }
  const [user, setUser] = useState(initialUser);

  const updateToken = newToken => {
    setItem(AUTH_TOKEN, newToken);
    if (newToken) {
      const { userId, userName, userRole, customerId } = parseJwt(newToken.access_token);
      setUser({ id: userId, email: userName, role: userRole, customerId });
    }
  };

  const updateUser = newUser => setUser({ ...user, ...newUser });

  return (
    <UserProvider
      id={user.id}
      email={user.email}
      role={user.role}
      customerId={user.customerId}
      updateUser={updateUser}
      updateToken={updateToken}
    >
      <ThemeProvider company={COMPANY} logo={logo} logoMobile={logoMobile}>
        <Helmet titleTemplate={`%s - ${COMPANY}`} defaultTitle={COMPANY}>
          <meta name="description" content={COMPANY} />
        </Helmet>

        <Switch>
          <UnauthenticatedRoute exact path="/login" component={Login} />
          <ProtectedRouteWithLayout exact path="/" component={RedirectToDashboard} />
          <ProtectedRouteWithLayout exact path="/dashboard" component={Dashboard} />
          <ProtectedRouteWithLayout path="/network" component={Network} />
          <ProtectedRouteWithLayout exact path="/profiles" component={Profiles} />
          <ProtectedRouteWithLayout exact path="/profiles/:id" component={ProfileDetails} />
          <ProtectedRouteWithLayout exact path="/addprofile" component={AddProfile} />

          <ProtectedRouteWithLayout exact path="/alarms" component={Alarms} />
          <ProtectedRouteWithLayout exact path="/account/edit" component={EditAccount} />
          {user.role === 'SuperUser' && (
            <ProtectedRouteWithLayout exact path="/accounts" component={Accounts} />
          )}
        </Switch>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
