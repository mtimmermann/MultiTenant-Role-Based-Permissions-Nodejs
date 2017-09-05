import './common/imports';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Auth from './modules/auth';

import MainRoutes from './common/main-routes';
import NavBar from './common/navbar';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company: { name: null, subdomain: null }
    };
  }

  componentWillMount() {
    Auth.getCompany((err, company) => {
      if (err) {
        console.log(err);
      } else if (company) {
        this.setState({ company });
      }
    });
  }

  render() {
    const isAuthenticated = Auth.isAuthenticated();
    return (
      <div>
        <NavBar
          isAuthenticated={isAuthenticated}
          user={Auth.getUser() || {}}
          company={this.state.company} />
        <div className="container-fluid">
          <MainRoutes isAuthenticated={isAuthenticated} company={this.state.company} />
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
