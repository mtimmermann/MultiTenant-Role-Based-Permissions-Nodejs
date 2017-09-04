import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

class FormSubmitErrors extends Component {
  render() {
    const errors = [];
    this.props.errors.forEach((error) => {
      errors.push(<li key={error}>{error}</li>);
    });
    const divs = [];
    if (errors.length > 0) {
      divs.push(
        <div key="alert-div" className="alert alert-danger">
          <ul>
            {errors}
          </ul>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="transition"
        transitionEnterTimeout={700}
        transitionLeaveTimeout={700}>
        {divs}
      </ReactCSSTransitionGroup>
    );
  }
}
FormSubmitErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FormSubmitErrors;
