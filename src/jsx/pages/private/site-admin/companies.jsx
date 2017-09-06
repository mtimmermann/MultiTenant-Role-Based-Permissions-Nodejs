import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table';

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
        this.setState({ errors: [err.message] });
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
            <NavLink className="btn btn-default btn-xs" to={`/siteadmin/companies/edit/${row.value}`}>
              <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
              Edit
            </NavLink>
            <NavLink className="btn btn-default btn-xs m-l-xs" to={`/siteadmin/companies/delete/${row.value}`}>
              <span className="glyphicon glyphicon-trash" aria-hidden="true" />
              Delete
            </NavLink>
            <NavLink className="btn btn-default btn-xs m-l-xs" to={`/siteadmin/companies/${row.value}/users`}>
              <span className="glyphicon glyphicon-cog" aria-hidden="true" />
              User Admin
            </NavLink>
          </div>
        )
        /* eslint-enable arrow-body-style */
      }
    ];

    return (
      <div>
        <div>
          <NavLink className="btn btn-default btn-xs m-b-sm" to={'/siteadmin/companies/new'}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true" />
            Add new Company
          </NavLink>
        </div>
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

export default Companies;
