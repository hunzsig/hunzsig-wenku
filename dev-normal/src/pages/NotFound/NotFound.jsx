import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {I18n} from 'h-react-antd';

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="not-found-page">
        <div className="basic-not-found" style={styles.notFoundContainer}>
          <div style={styles.notfoundContent}>
            <div className="prompt">
              <h3 style={styles.title}>{I18n.tr('sorryPageLost')}</h3>
              <p style={styles.description}>
                {I18n.tr('pageNotFound')}<Link to="/">{I18n.tr('homepage')}</Link>
                {I18n.tr('continue')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
