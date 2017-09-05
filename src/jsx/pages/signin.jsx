import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Auth from '../modules/auth';

import Utils from '../common/utils';
import ModelValidations from '../../shared/model-validations';
import FormValidationErrors from '../components/form-validation-errors';
import FormSubmitErrors from '../components/form-submit-errors';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      user: {
        email: '',
        password: ''
      },
      validation: {
        email: {
          valid: false,
          touched: false,
          message: ModelValidations.email.regex.message
        },
        password: {
          valid: false,
          touched: false,
          message: ModelValidations.password.minLength.message
        },
        formValid: false
      }
    };

    this.submit = this.submit.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  componentWillMount() {
    if (Auth.isAuthenticated()) {
      Auth.deauthenticateUser();
      this.props.history.push('/signin'); // Trigger navbar re-render
    }
  }

  componentDidMount() {
    Utils.focusFirstInput();
  }

  submit(evt) {
    evt.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {

        this.setState({ errors: [] });

        // Save the token
        Auth.authenticateUser(xhr.response.token, xhr.response.user);

        // Redirect to home page
        this.props.history.push('/');
      } else {

        const errors = [];
        if (xhr.response && xhr.response.message) {
          errors.push(xhr.response.message); // Summary
          const errObj = xhr.response.errors ? xhr.response.errors : {};
          Object.keys(errObj).forEach((key) => {
            errors.push(errObj[key]);
          });
        } else {
          errors.push(`${xhr.status} ${xhr.statusText}`);
        }

        this.setState({ errors: errors }); // eslint-disable-line object-shorthand
      }
    });
    xhr.send(formData);
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
      case 'email':
        validation.email.valid = (ModelValidations.email.regex.value).test(value);
        break;
      case 'password':
        validation.password.valid = value.length >= ModelValidations.password.minLength.value;
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

  render() {
    const validation = this.state.validation;
    return (
      <div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 form-header">
            <h4>Sign In { this.props.company.name && `- ${this.props.company.name}`}</h4>
            <div className="pull-right">
              Please enter email and password. Or <NavLink to="/signup">Sign up for a new account</NavLink>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4">
            <form className="form-horizontal" action="/" onSubmit={this.submit}>
              <div className={'form-group '+ (!validation.email.valid && validation.email.touched ? 'has-error' : '')}>
                <label className="col-sm-2 control-label" htmlFor="email">Email</label>
                <div className="col-sm-10">
                  <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={this.changeInput} />
                </div>
              </div>
              <div className={'form-group '+ (!validation.password.valid && validation.password.touched ? 'has-error' : '')}>
                <label className="col-sm-2 control-label" htmlFor="password">Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Login</button>
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
SignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  company: PropTypes.shape({
    name: PropTypes.string,
    subdomain: PropTypes.string
  }).isRequired
};

export default SignIn;
