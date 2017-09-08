import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/auth';
import { NavLink } from 'react-router-dom';
import Roles from '../../shared/roles';

class NavBar extends React.Component {

  // eslint-disable-next-line class-methods-use-this
  signOut() {
    Auth.deauthenticateUser();
  }

  render() {
    const isAuthenticated = this.props.isAuthenticated;
    const user = this.props.user;
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          {/* Brand and toggle get grouped for better mobile display */}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <NavLink to="/" className="navbar-brand">
              {this.props.company.name ? (
                this.props.company.name
              ) : (
                <div>Passport React Node.js</div>
              )}
            </NavLink>
          </div>

          {/* Collect the nav links, forms, and other content for toggling */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><NavLink to="/public1" activeClassName="active">Public</NavLink></li>
              {isAuthenticated && <li><NavLink to="/private1" activeClassName="active">Private</NavLink></li> }
              {isAuthenticated && user.role === Roles.admin &&
                <li className="dropdown">
                  <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                    Admin
                    <b className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink to="/admin1" activeClassName="active">Admin Page</NavLink></li>
                    <li role="separator" className="divider" />
                    <li><NavLink to="/admin/users" activeClassName="active">Users</NavLink></li>
                  </ul>
                </li>
              }
              {isAuthenticated && user.role === Roles.siteAdmin &&
                <li className="dropdown">
                  <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                    Admin
                    <b className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li><NavLink to="/admin1" activeClassName="active">Admin Page</NavLink></li>
                    <li role="separator" className="divider" />
                    <li><NavLink to="/siteadmin/companies" activeClassName="active">Company Admin</NavLink></li>
                    <li><NavLink to="/admin/users" activeClassName="active">All Users</NavLink></li>
                    <li><NavLink to="/siteadmin/companies/unassociated/users" activeClassName="active">Unassociated Users</NavLink></li>
                    <li role="separator" className="divider" />
                    <li><NavLink to="/siteadmin/logs?limit=200&start=0" activeClassName="active">Logs</NavLink></li>
                  </ul>
                </li>
              }
              <li className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                  About
                  <b className="caret" />
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="" data-toggle="modal" data-target="#modal-about">About: Boilerplate Role Based Permissions</a>
                  </li>
                  <li>
                    <a href="https://github.com/mtimmermann/Boilerplate-Role-Based-Permissions-Nodejs" target="_blank" rel="noopener noreferrer">Source Code on GitHub</a>
                  </li>
                </ul>
              </li>
            </ul>
            {isAuthenticated ? (
              <ul className="nav navbar-nav pull-right">
                <li className="dropdown">
                  <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                    {user.name}
                    <b className="caret" />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><NavLink to="/profile" activeClassName="active">Profile</NavLink></li>
                    <li><NavLink to="#" activeClassName="active" onClick={this.signOut}>Sign Out</NavLink></li>
                  </ul>
                </li>
              </ul>
            ) : (
              <ul className="nav navbar-nav pull-right">
                <li><NavLink to="/signin" activeClassName="active">Sign In</NavLink></li>
              </ul>
            )}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container-fluid */}
      </nav>
    );
  }
}
NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  company: PropTypes.shape({
    name: PropTypes.string,
    subdomain: PropTypes.string
  }).isRequired
};

export default NavBar;
