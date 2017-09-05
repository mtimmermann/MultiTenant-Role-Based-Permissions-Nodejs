import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table';
import Roles from '../../../../shared/roles';
import FormSubmitErrors from '../../../components/form-submit-errors';

import CompanyService from '../../../services/company-service';

class Companies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      data: [],
      pages: null,
      loading: true
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, /* instance */) {

    let sort = '';
    state.sorted.forEach((item) => {
      const dir = item.desc ? '-' : '';
      sort += dir + item.id +' ';
    });

    const query = `?page=${state.page+1}&limit=${state.pageSize}&sort=${sort}&filter=${JSON.stringify(state.filtered)}`;

    CompanyService.getCompanies(query, (err, data) => {
      if (err) {
        this.setState({ errors: [err] });
      } else {
        this.setState({
          errors: [],
          data: data.docs,
          pages: data.pages,
          loading: false
        });
      }
    });
  }

  render() {
    const { data, pages, loading } = this.state;
    const role = this.props.role;
    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Sub Domain',
        accessor: 'subdomain'
      },
      {
        Header: 'Action',
        accessor: 'id',
        sortable: false,
        filterable: false,
        /* eslint-disable arrow-body-style */
        Cell: row => (
          <div>
            <NavLink className="btn btn-default btn-xs" to={`/admin/users/edit/${row.value}`}>
              <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
              Edit
            </NavLink>
            <NavLink className="btn btn-default btn-xs m-l-xs" to={`/admin/users/delete/${row.value}`}>
              <span className="glyphicon glyphicon-trash" aria-hidden="true" />
              Delete
            </NavLink>
          </div>
        )
        /* eslint-enable arrow-body-style */
      }
    ];

    return (
      <div>
        <FormSubmitErrors errors={this.state.errors} />
        <ReactTable
          columns={columns}
          defaultSorted={[{ id: 'name', desc: false }]}
          manual // Forces table not to paginate or sort automatically, handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultPageSize={5}
          className="-striped -highlight" />
      </div>
    );
  }
}
Companies.propTypes = {
  role: PropTypes.string.isRequired
};

export default Companies;
