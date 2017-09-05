import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Utils from '../../../common/utils';
import Roles from '../../../../shared/roles';
import UserService from '../../../services/user-service';

import FormValidationErrors from '../../../components/form-validation-errors';
import FormSubmitErrors from '../../../components/form-submit-errors';

class UserEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      errors: [],
      user: { name: '', email: '' },
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
      },
      isFetching: true
    };

    this.submit = this.submit.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    UserService.getUser(this.state.id, (err, data) => {
      if (data && data.success) {
        this.setState({ user: data.data, isFetching: false });

        // Validate form after inputs are loaded
        Object.keys(this.state.user).forEach((key) => {
          this.validate(key, this.state.user[key]);
        });
      } else if (err) {
        this.setState({ errors: [err] });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isFetching !== this.state.isFetching) {
      Utils.focusFirstInput();
    }
  }

  submit(evt) {
    evt.preventDefault();

    UserService.updateUser(this.state.user, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err] });
      } else if (data && data.success) {
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
    const roleOptions = [];
    Roles.map().forEach((role) => {
      roleOptions.push(<option key={role.value} value={role.value}>{role.value}</option>);
    });
    return (
      <div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 form-header">
            <h4>Edit Profile</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4">
            <fieldset disabled={this.state.isFetching ? 'disabled' : ''}>
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
                  <label className="col-sm-2 control-label" htmlFor="role">Role</label>
                  <div className="col-sm-10">
                    <select className="form-control" id="role" name="role" value={this.state.user.role} onChange={this.changeInput} >
                      {roleOptions}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10">
                    <div>
                      <NavLink className="btn btn-default btn-xs m-b" to={`/admin/users/password/${this.state.id}`}>
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
                        Change Password
                      </NavLink>
                    </div>
                    <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                  </div>
                </div>
              </form>
            </fieldset>
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
UserEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

export default UserEdit;
