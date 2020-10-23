import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select} from 'antd';
import {Api, I18n, History} from 'h-react-antd';

class Add extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      name: '',
      upper_id: 0,
      status: 1,
      sort: 0,
    };
    this.state = {
      processing: false,
    }
  }

  componentDidMount() {
  }

  onFinish = (values) => {
    message.loading(I18n('Processing'));
    Api.query().post({ESSAY_CATEGORY_ADD: values}, (response) => {
      Api.handle(response,
        () => {
          message.success(I18n(['ADD', 'SUCCESS']));
          this.form.current.resetFields();
        }
      );
    });
  };

  onFinishFailed = () => {
    message.error(I18n('Please complete the form first.'));
  }


  render() {
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 18,
      },
    }
    return (
      <Form
        ref={this.form}
        initialValues={this.initialValues}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        {...layout}
      >
        <Form.Item name="name" label={I18n(['category', 'name'])} rules={[{required: true}]}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="status" label={I18n('status')} rules={[{required: true}]}>
          <Select
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.Essay_EssayCategoryStatus}
          />
        </Form.Item>
        <Form.Item name="sort" label={I18n('sort')}>
          <InputNumber min={0} max={99999} allowClear={true}/>
        </Form.Item>
        <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Add;