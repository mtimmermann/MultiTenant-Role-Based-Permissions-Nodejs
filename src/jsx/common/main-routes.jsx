import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Auth from '../modules/auth';
import PrivateRoutes from './private-routes';

import Home from '../pages/home';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';
import Public1 from '../pages/public1';

import Profile from '../pages/private/profile';
import ProfilePassword from '../pages/private/profile-password';
import Private1 from '../pages/private/private1';
import Admin1 from '../pages/private/admin1';

import Companies from '../pages/private/site-admin/companies';

import Users from '../pages/private/site-admin/users';
import UserEdit from '../pages/private/site-admin/user-edit';
import UserDelete from '../pages/private/site-admin/user-delete';
import UserPassword from '../pages/private/site-admin/user-password';

class MainRoutes extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/public1" component={Public1} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />

        <PrivateRoutes isAuthenticated={this.props.isAuthenticated} role={Auth.getRole()}>
          <Switch>
            {/* eslint-disable arrow-body-style, arrow-parens */}
            <Route path="/profile/password" render={(props) => (<ProfilePassword {...props} user={Auth.getUser()} />)} />
            <Route path="/profile" render={(props) => (<Profile {...props} user={Auth.getUser()} />)} />
            {/* eslint-enable arrow-body-style */}
            <Route path="/private1" component={Private1} />
            <Route path="/admin1" userRoles="Admin,SiteAdmin" component={Admin1} />
            <Route path="/admin/users/edit/:id" userRoles="SiteAdmin" component={UserEdit} />
            <Route path="/admin/users/delete/:id" userRoles="SiteAdmin" component={UserDelete} />
            <Route path="/admin/users/password/:id" userRoles="SiteAdmin" component={UserPassword} />
            {/* <Route path="/admin/users" userRoles="Admin,SiteAdmin" component={Users} /> */}
            {/* eslint-disable arrow-body-style, arrow-parens */}
            <Route path="/siteadmin/companies" userRoles="SiteAdmin" render={(props) => (<Companies {...props} role={Auth.getRole()} />)} />
            <Route path="/admin/users" userRoles="Admin,SiteAdmin" render={(props) => (<Users {...props} role={Auth.getRole()} />)} />
            {/* eslint-enable arrow-body-style */}
          </Switch>
        </PrivateRoutes>

        {/* <Route path="*" component={NotFound} /> */}
      </Switch>
    );
  }
}
MainRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default MainRoutes;
