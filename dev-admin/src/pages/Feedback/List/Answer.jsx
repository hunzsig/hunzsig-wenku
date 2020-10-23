import React, {Component} from 'react';
import {Button, Form, Input} from 'antd';
import {I18n} from 'h-react-antd';

class Answer extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();

  }

  onFinish = values => {
    for (let i in values) {
      if (!values[i]) {
        values[i] = undefined;
      }
    }
    this.props.onAnswer(values.answer);
  };

  render() {
    return (
      <Form
        className="h-react-filter"
        ref={this.form}
        onFinish={this.onFinish}
      >
        <Form.Item name="answer">
          <Input.TextArea rows={4}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Answer;