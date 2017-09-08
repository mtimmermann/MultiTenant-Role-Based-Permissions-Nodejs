import React, { Component } from 'react';
import LogService from '../../../services/log-service';

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: undefined
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

  render() {
    return (
      <div>
        <div>
          <h4>Query Param Options:</h4>
          {/* eslint-disable react/no-unescaped-entities, max-len */}
          <ul>
            <li>limit: &#123;number} - default 100</li>
            <li>start: &#123;number&#125; - start index, paging option</li>
            <li>fields: &#123;string&#125; - fields to include e.g. fields=timestamp,level,message,meta</li>
            <li>order: &#123;string&#125; - 'asc' or 'desc' default desc</li>
            <li>from: &#123;date&#125; - date filter start date</li>
            <li>until: &#123;date&#125; - date filter end query</li>
          </ul>
          {/* eslint-enable react/no-unescaped-entities, max-len */}
        </div>
        <pre>
          {JSON.stringify(this.state.logs, null, ' ')}
        </pre>
      </div>
    );
  }
}

export default Logs;
