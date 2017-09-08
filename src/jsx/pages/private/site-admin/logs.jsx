import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import LogService from '../../../services/log-service';
import JSONTree from 'react-json-tree';
import SmoothCollapse from 'react-smooth-collapse';

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: {},
      expanded: false
    };

    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    const urlParts = location.href.split('?');
    const query = urlParts.length === 2 ? `?${urlParts[1]}` : '';
    LogService.getLogs(query, (err, result) => {
      if (err) console.log(err);
      else {
        this.setState({ logs: result.data });
      }
    });
  }

  shouldExpandNode(/* keyName, data, level */) { // eslint-disable-line class-methods-use-this
    return true;
  }

  _toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded } = this.state;
    return (
      <div>
        <div>
          <h5>
            Query Param Options
            <NavLink className="btn btn-default btn-xs m-l-xs" to="#" onClick={() => { this._toggle(); }}>
              <span className={'glyphicon glyphicon-'+ (expanded ? 'minus' : 'plus')} aria-hidden="true" />
              {expanded ? ' Hide' : ' Show'}
            </NavLink>
          </h5>
          <SmoothCollapse expanded={expanded}>
            {/* eslint-disable react/no-unescaped-entities, max-len */}
            <div className="alert alert-info">
              <ul>
                <li>limit: &#123;number} - default 100</li>
                <li>start: &#123;number&#125; - start index, paging option</li>
                <li>fields: &#123;string&#125; - fields to include e.g. fields=timestamp,level,message,meta</li>
                <li>order: &#123;string&#125; - 'asc' or 'desc' default desc</li>
                <li>from: &#123;date&#125; - date filter start date</li>
                <li>until: &#123;date&#125; - date filter end query</li>
              </ul>
            </div>
          </SmoothCollapse>
          {/* eslint-enable react/no-unescaped-entities, max-len */}
        </div>
        {/*
        <pre>
          {JSON.stringify(this.state.logs, null, ' ')}
        </pre>
        */}
        <div>
          {/* eslint-disable react/jsx-boolean-value */}
          <JSONTree
            data={this.state.logs}
            hideRoot={true}
            shouldExpandNode={this.shouldExpandNode} />
        </div>
      </div>
    );
  }
}

export default Logs;
