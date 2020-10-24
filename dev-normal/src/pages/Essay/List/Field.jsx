import React, {Component} from 'react';
import {Checkbox} from 'antd';

class Field extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.options = [];
    this.rowKey = this.props.rowKey || 'title';
    if (this.props.columns) {
      this.props.columns.forEach((v) => {
        this.options.push(v[this.rowKey]);
      });
    }
  }

  onChange = checkedValues => {
    this.props.onField(checkedValues);
  };

  render() {
    return (
      <Checkbox.Group options={this.options} defaultValue={this.options} onChange={this.onChange}/>
    );
  }
}

export default Field;