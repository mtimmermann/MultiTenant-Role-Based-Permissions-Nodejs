import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MessageService from '../../services/message-service';

class Private1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      error: ''
    };

    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    MessageService.getPrivateMessage1((err, data) => {
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
            <h3>Private Page 1</h3>
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
              <ul>
                <li>/private1</li>
                <li>Requires auth token, any user role</li>
                <li>See src/jsx/common/main-routes.jsx</li>
              </ul>
              <li>Api route</li>
              <ul>
                <li>/api/messages/message1</li>
                <li>Requires auth token, any user role</li>
                <li>
                  See server/routes/api.js
                  {/* eslint-disable max-len */}
                  {/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes */}
                  <pre>
                    const authCheck = require('../middleware/auth-check'); <br /><br />

                    // GET /api/messages/private1 <br />
                    router.get('/messages/private1', authCheck(), messageController.getPrivateMessage1);
                  </pre>
                  {/* eslint-enable react/no-unescaped-entities, react/jsx-no-comment-textnodes, max-len */}
                </li>
              </ul>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Private1;
