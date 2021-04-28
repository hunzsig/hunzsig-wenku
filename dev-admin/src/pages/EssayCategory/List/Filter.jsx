import React, {Component} from 'react';
import {Form, Input, Button, Select} from 'antd';
import {History, I18n, Parse} from 'h-react-antd';

class Filter extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();

    this.search = Parse.urlSearch();
  }

  onFinish = values => {
    for (let i in values) {
      if (!values[i]) {
        values[i] = undefined;
      }
    }
    this.props.onFilter(values);
  };

  onClear = () => {
    this.form.current.setFieldsValue({
      id: undefined,
      user_id: undefined,
      name: undefined,
      level: undefined,
      status: undefined,
    });
  };

  // onReset = () => {
  //   this.form.current.resetFields();
  // };

  render() {
    const layout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    }
    return (
      <Form
        {...layout}
        className="h-react-filter"
        ref={this.form}
        initialValues={this.search}
        onFinish={this.onFinish}
      >
        <Form.Item name="id" label="ID">
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="user_id" label={I18n('user') + "ID"}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="name" label={I18n('name')}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="level" label={I18n('level')}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="status" label={I18n('status')}>
          <Select
            allowClear
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.Essay_EssayCategoryStatus}
          />
        </Form.Item>
        <Form.Item style={{textAlign: 'right'}}>
          <Button onClick={this.onClear}>{I18n('CLEAR')}</Button>
          <Button type="primary" htmlType="submit">{I18n('SEARCH')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Filter;