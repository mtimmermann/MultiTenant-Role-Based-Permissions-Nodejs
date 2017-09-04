import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import NotFound from '../pages/not-found';

const PrivateRoutes = ({ isAuthenticated, role, children }) => {

  let isFound = false;
  let hasPermissions = false;
  children.props.children.forEach(function(route) { // eslint-disable-line prefer-arrow-callback

    // Check if current path matches a route, and it has role permissions
    const routePath = route.props.path.toLowerCase();
    const routeMatcher = new RegExp(routePath.replace(/:[^\s/]+/g, '([\\w-]+)'));
    const url = location.pathname.toLowerCase();
    const match = url.match(routeMatcher);
    if (match && match.input === match[0]) {
      isFound = true;
      if (!route.props.userRoles) hasPermissions = true;
      else if (route.props.userRoles) {
        let roles = route.props.userRoles.replace(/\s/g, '');
        roles = roles.split(',');
        if (roles.indexOf(role) > -1) hasPermissions = true;
      }
    }
  });

  return (
    // eslint-disable-next-line no-nested-ternary
    isAuthenticated && hasPermissions && isFound ? (
      <div>
        {children}
      </div>
    ) : (
      !isFound ? (
        <NotFound />
      ) : (
        <Redirect to={{ pathname: '/signin' }} />
      )
    )
  );
};
PrivateRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  // children: PropTypes.instanceOf(Route).isRequired
};

export default PrivateRoutes;
