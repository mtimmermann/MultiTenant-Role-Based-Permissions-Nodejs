import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MessageService from '../../services/message-service';

class Admin1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      error: ''
    };

    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    MessageService.getAdminMessage1((err, data) => {
      if (err) {
        this.setState({ message: '', error: err });
      } else {
        this.setState({ message: data.message, error: '' });
      }
    });
  }

  render() {
    const divs = [];
    if (this.state.message || this.state.error) {
      divs.push(
        <div key="alert-div" className={'alert alert-'+ (this.state.message ? 'success' : 'warning')}>
          {this.state.message}
          {this.state.error}
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-6">
            <h3>Admin Page 1</h3>
            <ReactCSSTransitionGroup
              transitionName="transition"
              transitionEnterTimeout={700}
              transitionLeaveTimeout={700}>
              {divs}
            </ReactCSSTransitionGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-6">
            <ul className="well">
              <li>React route</li>
              {/* eslint-disable react/no-unescaped-entities */}
              <ul>
                <li>/admin1</li>
                <li>Requires auth token. User roles of 'Admin' or 'SiteAdmin'</li>
                <li>See src/jsx/common/main-routes.jsx</li>
              </ul>
              <li>Api route</li>
              <ul>
                <li>/api/messages/admin1</li>
                <li>Requires auth token. User roles of 'Admin' or 'SiteAdmin'</li>
                <li>
                  See server/routes/api.js
                  {/* eslint-disable max-len */}
                  {/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes */}
                  <pre>
                    const authCheck = require('../middleware/auth-check'); <br /><br />

                    // GET /api/messages/admin1 <br />
                    router.get('/messages/admin1', authCheck([Roles.admin,Roles.siteAdmin]), messageController.getAdminMessage1);
                  </pre>
                  {/* eslint-enable react/no-unescaped-entities, react/jsx-no-comment-textnodes, max-len */}
                </li>
              </ul>
              {/* eslint-enable react/no-unescaped-entities */}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin1;
