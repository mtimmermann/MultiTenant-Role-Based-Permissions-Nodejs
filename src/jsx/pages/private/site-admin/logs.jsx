import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import LogService from '../../../services/log-service';
import JSONTree from 'react-json-tree';
import SmoothCollapse from 'react-smooth-collapse';
import Utils from '../../../common/utils';

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      filter: {
        level: '',
        message: ''
      },
      display: {
        tree: true
      },
      infoExpanded: false
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.shouldExpandNode = this.shouldExpandNode.bind(this);
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

    // Setup this.state.filter from query
    const filter = this.state.filter;
    const queryObj = Utils.parseQueryString(query);
    if (queryObj.filter_level) filter.level = queryObj.filter_level;
    if (queryObj.filter_message) {
      filter.message = decodeURIComponent(queryObj.filter_message);
    }
    if (filter !== this.state.filter) this.setState({ filter /* :filter */ });

    // Setup display options from query
    if (queryObj.raw && (/true/i).test(queryObj.raw)) {
      this.setState({
        display: { tree: false }
      });
    }
  }

  // componentDidUpdate(/* prevProps, prevState */) {
  //   if (this.state.filter.level) {
  //     // Using array filter -> "Maximum call stack size exceeded"
  //     const filtered = this.state.logs.filter((row) => {
  //       return row.level === this.state.filter.level;
  //     });
  //     this.setState({ logs: filtered });
  //   } else if (this.state.filter.message) {
  //   }
  // }

  shouldExpandNode(keyName, data, level) { // eslint-disable-line class-methods-use-this
    const filter = this.state.filter;
    if ((filter.level || filter.message) && level === 1 && (data.level || data.message)) {
      if (filter.level && filter.level === data.level) return true;
      if (filter.message && data.message) {
        const regex = new RegExp(filter.message, 'gi');
        if (regex.test(data.message)) return true;
        if (data.meta && data.meta.message) {
          if (regex.test(data.meta.message)) return true;
        }
        return false;
      }
      return false;
    }
    return true;
  }

  _toggleInfo(evt) {
    evt.preventDefault();
    this.setState({ infoExpanded: !this.state.infoExpanded });
  }
  _toggleDisplay(evt) {
    evt.preventDefault();
    this.setState({ display: { tree: !this.state.display.tree } });
  }

  render() {
    const { infoExpanded } = this.state;
    const displayTree = this.state.display.tree;
    return (
      <div>
        <div>
          <h5>
            Query Param Options
            <NavLink className="btn btn-default btn-xs m-l-xs" to="#" onClick={(evt) => { this._toggleInfo(evt); }}>
              <span className={'glyphicon glyphicon-'+ (infoExpanded ? 'minus' : 'plus')} aria-hidden="true" />
              {infoExpanded ? ' Hide' : ' Show'}
            </NavLink>
            <NavLink className="btn btn-default btn-xs m-l-lg" to="#" onClick={(evt) => { this._toggleDisplay(evt); }}>
              <span className={'glyphicon glyphicon-'+ (displayTree ? 'list' : 'tree-conifer')} aria-hidden="true" />
              {displayTree ? ' Display Raw' : ' Display Tree'}
            </NavLink>
          </h5>
          <SmoothCollapse expanded={infoExpanded}>
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
              <ul>
                <li>Display Options</li>
                <ul>
                  <li>raw: &#123;boolean&#125; - Display raw json when raw=true</li>
                </ul>
              </ul>
            </div>
          </SmoothCollapse>
          {/* eslint-enable react/no-unescaped-entities, max-len */}
        </div>
        {displayTree &&
          <div>
            {/* eslint-disable react/jsx-boolean-value */}
            <JSONTree
              data={this.state.logs}
              hideRoot={true}
              shouldExpandNode={this.shouldExpandNode} />
            {/* eslint-enable react/jsx-boolean-value */}
          </div>
        }
        {!displayTree &&
          <div>
            <pre>
              {JSON.stringify(this.state.logs, null, ' ')}
            </pre>
          </div>
        }
      </div>
    );
  }
}

export default Logs;
