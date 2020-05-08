import React from 'react';
import PropTypes from 'prop-types';

import UserContext from 'contexts/UserContext';

const UserProvider = ({ children, email, role, customerId }) => (
  <UserContext.Provider value={{ email, role, customerId }}>{children}</UserContext.Provider>
);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  customerId: PropTypes.number.isRequired,
};

export default UserProvider;
