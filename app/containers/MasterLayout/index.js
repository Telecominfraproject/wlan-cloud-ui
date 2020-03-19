import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { MasterLayout as Layout } from 'cu-ui';

import { makeSelectLocation } from 'containers/App/selectors';

import logo from 'images/logo-light.png';
import logoMobile from 'images/logoxmobile.jpg';

const MasterLayout = ({ children, locationState }) => (
  <Layout logo={logo} logoMobile={logoMobile} onLogout={() => {}} locationState={locationState}>
    {children}
  </Layout>
);

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
  locationState: PropTypes.instanceOf(Object).isRequired,
};

export const mapStateToProps = createStructuredSelector({
  locationState: makeSelectLocation(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(MasterLayout);
