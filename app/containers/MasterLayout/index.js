import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { AppLayout as Layout } from 'cu-ui';

const MasterLayout = ({ children }) => {
  const location = useLocation();
  return (
    <Layout onLogout={() => {}} locationState={location}>
      {children}
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterLayout;
