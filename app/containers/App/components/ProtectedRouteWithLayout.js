import React from 'react';
import T from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import UserProvider from 'contexts/UserProvider';
import MasterLayout from 'containers/MasterLayout';
import { AUTH_TOKEN } from 'constants/index';

import { getItem } from 'utils/localStorage';
import { parseJwt } from 'utils/jwt';

const ProtectedRouteWithLayout = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const token = getItem(AUTH_TOKEN);

      if (token) {
        const jwt = parseJwt(token.access_token);

        return (
          <UserProvider email={jwt.userName} role={jwt.userRole} customerId={jwt.customerId}>
            <MasterLayout>
              <Component {...props} />
            </MasterLayout>
          </UserProvider>
        );
      }

      return (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      );
    }}
  />
);

ProtectedRouteWithLayout.propTypes = {
  component: T.func.isRequired,
};

export default ProtectedRouteWithLayout;
