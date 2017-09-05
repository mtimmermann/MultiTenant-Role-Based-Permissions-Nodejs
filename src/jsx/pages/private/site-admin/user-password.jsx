import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserService from '../../../services/user-service';
import PasswordChangeForm from '../../../components/password-change-form';

class UserPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      errors: [],
      user: { name: '', email: '', password: '' },
      isFetching: true
    };

    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    UserService.getUser(this.state.id, (err, data) => {
      if (data && data.success) {
        this.setState({ user: data.data, isFetching: false });
      } else if (err) {
        this.setState({ errors: [err] });
      }
    });
  }

  submit(evt) {
    evt.preventDefault();

    UserService.adminUserPassword(this.state.user, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err] });
      } else if (data && data.success) {
        this.props.history.push('/admin/users');
      }
    });
  }

  render() {
    return (
      <div>
        <PasswordChangeForm
          user={this.state.user}
          submit={this.submit}
          errors={this.state.errors}
          history={this.props.history}
          isFetching={this.state.isFetching} />
      </div>
    );
  }
}
UserPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default UserPassword;
