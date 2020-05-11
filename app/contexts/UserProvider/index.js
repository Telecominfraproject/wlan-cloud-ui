import React from 'react';
import PropTypes from 'prop-types';

import UserContext from 'contexts/UserContext';

const UserProvider = ({ children, id, email, role, customerId }) => (
  <UserContext.Provider value={{ id, email, role, customerId }}>{children}</UserContext.Provider>
);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  customerId: PropTypes.number.isRequired,
};

export default UserProvider;
