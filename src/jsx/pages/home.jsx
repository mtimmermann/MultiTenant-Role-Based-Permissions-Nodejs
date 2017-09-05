import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Home extends Component {
  render() {
    return (
      <h3>Home Page {this.props.company && this.props.company.name && `- ${this.props.company.name}`}</h3>
    );
  }
}
Home.propTypes = {
  company: PropTypes.oneOfType([
    null,
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      subdomain: PropTypes.string.isRequired
    }).isRequired
  ]).isRequired
};

export default Home;
