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
import CompanyNew from '../pages/private/site-admin/company-new';
import CompanyEdit from '../pages/private/site-admin/company-edit';
import CompanyDelete from '../pages/private/site-admin/company-delete';

import Users from '../pages/private/site-admin/users';
import UserEdit from '../pages/private/site-admin/user-edit';
import UserDelete from '../pages/private/site-admin/user-delete';
import UserPassword from '../pages/private/site-admin/user-password';

class MainRoutes extends React.Component {
  render() {
    return (
      <Switch>
        {/* eslint-disable arrow-body-style, arrow-parens */}
        <Route exact path="/" render={(props) => (<Home {...props} company={this.props.company} />)} />
        <Route exact path="/public1" component={Public1} />
        <Route exact path="/signin" render={(props) => (<SignIn {...props} company={this.props.company} />)} />
        <Route exact path="/signup" render={(props) => (<SignUp {...props} company={this.props.company} />)} />

        <PrivateRoutes isAuthenticated={this.props.isAuthenticated} role={Auth.getRole()}>
          <Switch>
            <Route exact path="/profile/password" render={(props) => (<ProfilePassword {...props} user={Auth.getUser()} />)} />
            <Route exact path="/profile" render={(props) => (<Profile {...props} user={Auth.getUser()} />)} />
            <Route exact path="/private1" component={Private1} />

            <Route exact path="/admin1" userRoles="Admin,SiteAdmin" component={Admin1} />

            <Route exact path="/admin/users" userRoles="Admin,SiteAdmin" render={(props) => (<Users {...props} role={Auth.getRole()} />)} />
            <Route exact path="/admin/users/edit/:id" userRoles="Admin,SiteAdmin" render={(props) => (<UserEdit {...props} role={Auth.getRole()} />)} />
            <Route exact path="/admin/users/delete/:id" userRoles="Admin,SiteAdmin" component={UserDelete} />
            <Route exact path="/admin/users/password/:id" userRoles="Admin,SiteAdmin" component={UserPassword} />

            <Route exact path="/siteadmin/companies" userRoles="SiteAdmin" render={(props) => (<Companies {...props} role={Auth.getRole()} />)} />
            <Route exact path="/siteadmin/companies/new" userRoles="SiteAdmin" render={(props) => (<CompanyNew {...props} role={Auth.getRole()} />)} />
            <Route exact path="/siteadmin/companies/edit/:id" userRoles="SiteAdmin" render={(props) => (<CompanyEdit {...props} role={Auth.getRole()} />)} />
            <Route exact path="/siteadmin/companies/delete/:id" userRoles="SiteAdmin" render={(props) => (<CompanyDelete {...props} role={Auth.getRole()} />)} />

            <Route exact path="/siteadmin/companies/:companyId/users" userRoles="SiteAdmin" render={(props) => (<Users {...props} role={Auth.getRole()} />)} />
          </Switch>
        </PrivateRoutes>

        {/* <Route path="*" component={NotFound} /> */}
        {/* eslint-enable arrow-body-style, arrow-parens */}
      </Switch>
    );
  }
}
MainRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  company: PropTypes.shape({
    name: PropTypes.string,
    subdomain: PropTypes.string
  }).isRequired
};

export default MainRoutes;
