import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserService from '../../services/user-service';
import PasswordChangeForm from '../../components/password-change-form';

class ProfilePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      user: this.props.user
    };

    this.submit = this.submit.bind(this);
  }

  submit(evt) {
    evt.preventDefault();

    UserService.profileUserPassword(this.state.user, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err.message] });
      } else if (data && data.success) {
        this.props.history.push('/');
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
          isFetching={false} />
      </div>
    );
  }
}
ProfilePassword.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default ProfilePassword;
