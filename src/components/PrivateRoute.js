import React from 'react';

const PrivateRoute = ({ children }) => {
  // Always render the children without any authentication checks
  return children;
};

export default PrivateRoute; 