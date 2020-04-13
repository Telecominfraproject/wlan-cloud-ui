import React from 'react';
import T from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { AUTH_TOKEN } from 'constants/index';

import { getItem } from 'utils/localStorage';

const UnauthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !getItem(AUTH_TOKEN) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      )
    }
  />
);

UnauthenticatedRoute.propTypes = {
  component: T.func.isRequired,
};

export default UnauthenticatedRoute;
