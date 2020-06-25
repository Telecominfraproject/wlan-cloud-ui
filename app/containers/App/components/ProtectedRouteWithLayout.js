import React from 'react';
import T from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import MasterLayout from 'containers/MasterLayout';
import { AUTH_TOKEN } from 'constants/index';

import { getItem } from 'utils/localStorage';

const ProtectedRouteWithLayout = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getItem(AUTH_TOKEN) ? (
        <MasterLayout>
          <Component {...props} {...rest} />
        </MasterLayout>
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      )
    }
  />
);

ProtectedRouteWithLayout.propTypes = {
  component: T.func.isRequired,
};

export default ProtectedRouteWithLayout;
