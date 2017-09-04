import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

class FormValidationErrors extends Component {
  render() {
    const validation = this.props.validation;
    const errors = [];
    Object.keys(validation).forEach((key) => {
      if (typeof validation[key].valid === 'boolean' &&
          typeof validation[key].touched === 'boolean' &&
          typeof validation[key].message === 'string' &&
          !validation[key].valid &&
          validation[key].touched) {
        errors.push(<li key={key}>{validation[key].message}</li>);
      }
    });

    const divs = [];
    if (errors.length > 0) {
      divs.push(
        <div key="alert-div" className="alert alert-warning">
          <ul>
            <ReactCSSTransitionGroup
              transitionName="transition"
              transitionEnterTimeout={700}
              transitionLeaveTimeout={700}>
              {errors}
            </ReactCSSTransitionGroup>
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
FormValidationErrors.propTypes = {
  validation: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default FormValidationErrors;
