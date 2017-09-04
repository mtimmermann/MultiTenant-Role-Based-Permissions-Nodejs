import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Utils from '../common/utils';
import ModelValidations from '../../shared/model-validations';
import FormValidationErrors from './form-validation-errors';
import FormSubmitErrors from './form-submit-errors';

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validation: {
        password: {
          valid: false,
          touched: false,
          message: 'Password must be a mininum of 8 characters'
        },
        passwordConfirm: {
          valid: false,
          touched: false,
          message: ModelValidations.password.minLength.message
        },
        formValid: false
      }
    };

    this.changeInput = this.changeInput.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    Utils.focusFirstInput();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFetching !== this.props.isFetching) {
      Utils.focusFirstInput();
    }
  }

  changeInput(evt) {
    const field = evt.target.name;
    const value = evt.target.value;
    const user = this.props.user;
    user[field] = value;

    this.setState({
      errors: []
    });
    this.validate(field, value);
  }

  validate(field, value) {
    const validation = this.state.validation;
    if (validation[field]) validation[field].touched = true;

    switch (field) {
      case 'password':
        validation.password.valid = value.length >= ModelValidations.password.minLength.value;
        break;
      case 'passwordConfirm':
        validation.passwordConfirm.valid = value === this.props.user.password;
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
            <h4>Change Password</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4">
            <fieldset disabled={this.props.isFetching ? 'disabled' : ''}>
              <form className="form-horizontal" action="/" onSubmit={this.props.submit}>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="name">Name</label>
                  <div className="col-sm-10">
                    <input disabled type="text" className="form-control" id="name" name="name" value={this.props.user.name} placeholder="Name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="email">Email</label>
                  <div className="col-sm-10">
                    <input disabled type="email" className="form-control" id="email" name="email" value={this.props.user.email} placeholder="Email" onChange={this.changeInput} />
                  </div>
                </div>
                <div className={'form-group '+ (!validation.password.valid && validation.password.touched ? 'has-error' : '')}>
                  <label className="col-sm-2 control-label" htmlFor="password">Password</label>
                  <div className="col-sm-10">
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={this.changeInput} />
                  </div>
                </div>
                <div className={'form-group '+ (!validation.passwordConfirm.valid && validation.passwordConfirm.touched ? 'has-error' : '')}>
                  <label className="col-sm-2 control-label" htmlFor="passwordConfirm">Confirm</label>
                  <div className="col-sm-10">
                    <input type="password" className="form-control" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm Password" autoComplete="off" onChange={this.changeInput} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10">
                    <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                  </div>
                </div>
              </form>
            </fieldset>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <FormValidationErrors validation={validation} />
            <FormSubmitErrors errors={this.props.errors} />
          </div>
        </div>
      </div>
    );
  }
}
PasswordChangeForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string
  }).isRequired,
  submit: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default PasswordChangeForm;
