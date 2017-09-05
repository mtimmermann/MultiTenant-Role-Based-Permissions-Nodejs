import './common/imports';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Auth from './modules/auth';

import MainRoutes from './common/main-routes';
import NavBar from './common/navbar';

class App extends React.Component {
  render() {
    const isAuthenticated = Auth.isAuthenticated();
    return (
      <div>
        <NavBar
          isAuthenticated={isAuthenticated}
          user={Auth.getUser() || {}}
          company={Auth.getCompany()} />
        <div className="container-fluid">
          <MainRoutes isAuthenticated={isAuthenticated} company={Auth.getCompany()} />
        </div>
      </div>
    );
  }
}

$(() => {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.querySelector('#container-main')
  );
});
