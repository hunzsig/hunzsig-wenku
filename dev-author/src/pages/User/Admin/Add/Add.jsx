import React, {Component} from 'react';
import {message, Form, Input, Button, Select} from 'antd';
import {Api, I18n, History} from 'h-react-antd';

class Add extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      status: 1,
    };
    this.state = {
      processing: false,
    }
  }

  componentDidMount() {
  }

  onFinish = (values) => {
    message.loading(I18n('Processing'));
    values.licenses = [2];
    values.accounts = {
      [values.mobile]: 'phone',
    };
    values.mobile = undefined;
    Api.query().post({USER_ADD: values}, (response) => {
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
        <Form.Item name="mobile" label={I18n('mobile number')} rules={[{required: true}]}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item
          label={I18n(['LOGIN', 'PASSWORD'])}
          name="password"
          rules={[
            {required: true},
            ({getFieldValue}) => ({
              validator(rule, value) {
                const pwd = getFieldValue('password');
                if (pwd.length < 4) {
                  return Promise.reject(I18n('Password cannot be less than 4 digits'));
                }
                if (pwd.length > 16) {
                  return Promise.reject(I18n('Password cannot be greater than 16 digits'));
                }
                if (pwd.indexOf(" ") !== -1) {
                  return Promise.reject(I18n('Password must not contain spaces'));
                }
                return Promise.resolve();
              },
            })
          ]}
        >
          <Input.Password
            placeholder={I18n(['PLEASE_INPUT', 'LOGIN', 'PASSWORD'])}
            allowClear={true}
          />
        </Form.Item>
        <Form.Item name="status" label={I18n('status')} rules={[{required: true}]}>
          <Select
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.User_UserStatus}
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