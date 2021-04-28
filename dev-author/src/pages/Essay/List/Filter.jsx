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
      title: undefined,
      category_id: undefined,
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
        <Form.Item name="title" label={I18n('title')}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="category_id" label={I18n('CATEGORY')}>
          <Select
            showSearch
            allowClear
            placeholder={I18n('PLEASE_CHOOSE')}
            optionFilterProp="children"
            options={this.props.prepare.categoryMapping}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        <Form.Item name="status" label={I18n('status')}>
          <Select
            allowClear
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.Essay_EssayStatus}
          />
        </Form.Item>
        <Form.Item name="is_excellent" label={I18n('excellent')}>
          <Select
            allowClear
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.Common_Boolean}
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