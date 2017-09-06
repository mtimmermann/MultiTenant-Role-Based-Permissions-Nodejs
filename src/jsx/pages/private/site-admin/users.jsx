import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table';
import Roles from '../../../../shared/roles';
import FormSubmitErrors from '../../../components/form-submit-errors';
import UserService from '../../../services/user-service';
import Utils from '../../../common/utils';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyId: this.props.match.params.companyId || '',
      query: '',
      errors: [],
      data: [],
      pages: null,
      loading: true
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    // This code block is effectively forcing a re-render of the ReactTable.
    // When the previous route is switched for example:
    //    from: /siteadmin/companies/:companyID/users
    //    to:   /siteadmin/users
    //  the table is not re-rendered since both routes use the same 'Users'
    //  component. This code block detects the route switch and updates
    //  the query appropiatly and re-fetches the data
    const routeChanged = nextProps.location !== this.props.location;
    if (routeChanged) {
      const queryObj = Utils.parseQueryString(this.state.query);
      queryObj.companyId = nextProps.match.params.companyId || '';
      const query = `?${$.param(queryObj)}`;
      this.setState({ companyId: '' });
      this.getUsers(query);
    }
  }

  getUsers(query) {
    UserService.getUsers(query, (err, data) => {
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
  fetchData(state, /* instance */) {
    let sort = '';
    state.sorted.forEach((item) => {
      const dir = item.desc ? '-' : '';
      sort += dir + item.id +' ';
    });

    const query = `?page=${state.page+1}&limit=${state.pageSize}&sort=${sort}` +
      `&filter=${JSON.stringify(state.filtered)}&companyId=${this.state.companyId}`;
    this.setState({ query /* :query */ });
    this.getUsers(query);
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
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'role',
        accessor: 'role'
      },
      {
        Header: 'company',
        accessor: 'company.name',
        filterable: false,
        sortable: false
      },
      {
        Header: 'CreatedAt',
        accessor: 'createdAt',
        filterable: false
      },
      {
        Header: 'UpdatedAt',
        accessor: 'updatedAt',
        filterable: false
      }
    ];
    if (role === Roles.siteAdmin) {
      columns.push(
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
      );
    }

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
Users.propTypes = {
  role: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      companyId: PropTypes.string
    })
  }),
  location: PropTypes.shape({}).isRequired
};
Users.defaultProps = {
  match: { companyId: '' }
};


export default Users;
