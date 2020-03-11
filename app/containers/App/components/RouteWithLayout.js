import React from 'react';
import T from 'prop-types';
import { Route } from 'react-router-dom';

import MasterLayout from 'containers/MasterLayout';

const RouteWithLayout = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <MasterLayout>
        <Component {...props} />
      </MasterLayout>
    )}
  />
);

RouteWithLayout.propTypes = {
  component: T.func.isRequired,
};

export default RouteWithLayout;
