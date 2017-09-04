import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Utils from '../../common/utils';
import Auth from '../../modules/auth';
import UserService from '../../services/user-service';

import FormValidationErrors from '../../components/form-validation-errors';
import FormSubmitErrors from '../../components/form-submit-errors';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      user: this.props.user,
      validation: {
        name: {
          valid: false,
          touched: false,
          message: 'Name is required'
        },
        email: {
          valid: false,
          touched: false,
          message: 'Email is invalid'
        },
        formValid: false
      }
    };

    this.submit = this.submit.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    // Validate form after initial render
    Object.keys(this.state.user).forEach((key) => {
      this.validate(key, this.state.user[key]);
    });

    Utils.focusFirstInput();
  }

  submit(evt) {
    evt.preventDefault();

    UserService.updateProfile(this.state.user, (err, data) => {
      if (err) {
        this.setState({ errors: data && data.errors ? data.errors : [err] });
      } else if (data && data.success) {
        Auth.updateUser(this.state.user);
        this.props.history.goBack();
      }
    });
  }

  changeInput(evt) {
    const field = evt.target.name;
    const value = evt.target.value;
    const user = this.state.user;
    user[field] = value;

    this.setState({
      errors: [],
      user: user // eslint-disable-line object-shorthand
    });
    this.validate(field, value);
  }

  validate(field, value) {
    const validation = this.state.validation;
    if (validation[field]) validation[field].touched = true;

    switch (field) {
      case 'name':
        validation.name.valid = value.length > 0;
        break;
      case 'email':
        validation.email.valid = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(value);
        break;
    }

    validation.formValid = true;
    Object.keys(validation).forEach((key) => {
      if (typeof validation[key].valid === 'boolean' && !validation[key].valid) {
        validation.formValid = false;
      }
    });

    this.setState({ validation: validation }); // eslint-disable-line object-shorthand
  }

  cancel() {
    this.props.history.goBack();
  }

  render() {
    const validation = this.state.validation;
    return (
      <div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 form-header">
            <h4>Edit Profile</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4">
            <form className="form-horizontal" action="/" onSubmit={this.submit}>
              <div className={'form-group '+ (!validation.name.valid && validation.name.touched ? 'has-error' : '')}>
                <label className="col-sm-2 control-label" htmlFor="name">Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="name" name="name" value={this.state.user.name} placeholder="Name" onChange={this.changeInput} />
                </div>
              </div>
              <div className={'form-group '+ (!validation.email.valid && validation.email.touched ? 'has-error' : '')}>
                <label className="col-sm-2 control-label" htmlFor="email">Email</label>
                <div className="col-sm-10">
                  <input type="email" className="form-control" id="email" name="email" value={this.state.user.email} placeholder="Email" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <div>
                    <NavLink className="btn btn-default btn-xs m-b" to={'/profile/password'}>
                      <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
                      Change Password
                    </NavLink>
                  </div>
                  <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <FormValidationErrors validation={validation} />
            <FormSubmitErrors errors={this.state.errors} />
          </div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

export default Profile;
