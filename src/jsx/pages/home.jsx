import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Home extends Component {
  render() {
    return (
      <div className="branding-home-header">
        <h3>Home Page {this.props.company.name && `- ${this.props.company.name}`}</h3>
      </div>
    );
  }
}
Home.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    subdomain: PropTypes.string
  }).isRequired
};

export default Home;
