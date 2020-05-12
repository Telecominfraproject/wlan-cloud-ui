import React from 'react';
import PropTypes from 'prop-types';

import UserContext from 'contexts/UserContext';

const UserProvider = ({ children, id, email, role, customerId, updateUser }) => (
  <UserContext.Provider value={{ id, email, role, customerId, updateUser }}>
    {children}
  </UserContext.Provider>
);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  updateUser: PropTypes.func.isRequired,
  id: PropTypes.number,
  email: PropTypes.string,
  role: PropTypes.string,
  customerId: PropTypes.number,
};

UserProvider.defaultProps = {
  id: null,
  email: null,
  role: null,
  customerId: null,
};

export default UserProvider;
