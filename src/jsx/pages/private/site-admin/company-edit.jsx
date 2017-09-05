import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CompanyService from '../../../services/company-service';
import CompanyEditForm from '../../../components/company-edit-form';

class CompanyEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      errors: [],
      company: { name: '', subdomain: '' },
      isFetching: true
    };

    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    CompanyService.getCompany(this.state.id, (err, data) => {
      if (data && data.success) {
        this.setState({ company: data.data, isFetching: false });
      } else if (err) {
        this.setState({ errors: [err.message] });
      }
    });
  }

  submit(evt) {
    evt.preventDefault();

    CompanyService.updateCompany(this.state.company, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err.message] });
      } else if (data && data.success) {
        this.props.history.push('/siteadmin/companies');
      }
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-5 col-md-5 col-lg-5 form-header">
            <h4>Edit Company</h4>
          </div>
        </div>
        <div className="row">
          <CompanyEditForm
            company={this.state.company}
            submit={this.submit}
            errors={this.state.errors}
            history={this.props.history}
            isFetching={this.state.isFetching} />
        </div>
      </div>
    );
  }
}
CompanyEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default CompanyEdit;
