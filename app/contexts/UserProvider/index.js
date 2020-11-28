import React from 'react';
import PropTypes from 'prop-types';

import UserContext from 'contexts/UserContext';

const UserProvider = ({ children, id, email, roles, customerId, updateUser, updateToken }) => (
  <UserContext.Provider value={{ id, email, roles, customerId, updateUser, updateToken }}>
    {children}
  </UserContext.Provider>
);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  id: PropTypes.number,
  email: PropTypes.string,
  roles: PropTypes.instanceOf(Array),
  customerId: PropTypes.number,
};

UserProvider.defaultProps = {
  id: null,
  email: null,
  roles: [],
  customerId: null,
};

export default UserProvider;
