import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select} from 'antd';
import {Api, I18n, History} from 'h-react-antd';

class Add extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      key: undefined,
      label: undefined,
      value_format: undefined,
      value_default: '',
      component: 'input_string',
      component_data: '',
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
    this.setState({processing: true});
    Api.query().post({USER_META_CATEGORY_ADD: values}, (response) => {
      this.setState({processing: false});
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
        <Form.Item name="key" label="key" rules={[{required: true}]}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="label" label={I18n(["name"])}>
          <Input
            allowClear={true}
            placeholder={I18n('Will be automatically translated, it is recommended to fill in English.')}
          />
        </Form.Item>
        <Form.Item name="value_format" label={I18n(["format", "type"])} rules={[{required: true}]}>
          <Select placeholder={I18n('PLEASE_CHOOSE')}>
            {
              History.state.mapping.yonna.antd.User_MetaValueFormat.map((val) => {
                return <Select.Option key={val.value}>{I18n(val.label)}</Select.Option>;
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name="value_default" label={I18n(["default", "value"])}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="component" label={I18n('component')} rules={[{required: true}]}>
          <Select
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.User_MetaComponent}
          />
        </Form.Item>
        <Form.Item name="component_data" label={I18n(['component', 'data', 'source'])}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="sort" label={I18n('sort')}>
          <InputNumber min={0} max={99999} allowClear={true}/>
        </Form.Item>
        <Form.Item name="status" label={I18n('status')} rules={[{required: true}]}>
          <Select
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.User_MetaCategoryStatus}
          />
        </Form.Item>
        <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Add;