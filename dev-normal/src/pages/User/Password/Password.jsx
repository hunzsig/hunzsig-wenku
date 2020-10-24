import React, {Component} from 'react';
import {message, Form, Input, Button} from 'antd';
import {Api, I18n} from 'h-react-antd';

class EditInfo extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      password: '',
      confirm_password: '',
    };
    this.state = {
      userInfo: {},
      visible: false,
      processing: false,
    }
  }

  componentDidMount() {
  }

  onFinish = (values) => {
    message.loading(I18n('Processing'));
    this.setState({
      processing: true,
    });
    Api.query().post({ME_PASSWORD: values}, (response) => {
      this.setState({
        processing: false,
      });
      Api.handle(response,
        () => {
          message.success(I18n(['SAVE', 'SUCCESS']));
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
        span: 6,
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
        <Form.Item
          label={I18n('PASSWORD')}
          key="password"
          name="password"
          rules={[
            {
              required: true,
              message: I18n(['INPUT', 'YOUR', 'PASSWORD']) + '!',
            },
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
            }),
          ]}
        >
          <Input.Password
            placeholder={
              I18n(['PLEASE_INPUT', 'YOUR', 'NEW', 'PASSWORD'])
              + '(' + I18n("Fill in the blank to indicate no modification") + ')'
            }
            name="password"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.password !== currentValues.password}
        >
          {({getFieldValue}) => {
            return (getFieldValue('password') || '') !== '' ? (
              <Form.Item
                label={I18n('CONFIRM_PASSWORD')}
                key="confirm_password"
                name="confirm_password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: I18n(['CONFIRM', 'YOUR', 'PASSWORD']) + '!',
                  },
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      const pwd = getFieldValue('password');
                      if (!value || pwd === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(I18n('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder={I18n(['PLEASE_INPUT', 'YOUR', 'NEW', 'PASSWORD'])}
                  name="password"
                  allowClear={true}
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default EditInfo;