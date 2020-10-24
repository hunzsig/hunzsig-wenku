import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select, Spin} from 'antd';
import {Api, I18n, Parse, History} from 'h-react-antd';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.state = {
      id: this.search.id,
      info: null,
    }
  }

  componentDidMount() {
    if (this.state.id) {
      Api.query().post({USER_INFO: {id: this.state.id}}, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data, 'user_');
            info.mobile = null;
            for (let i in info.account) {
              if (info.account[i].user_account_type === 'phone') {
                info.mobile = info.account[i].user_account_string;
                break;
              }
            }
            this.setState({
              info: info,
            });
          }
        );
      });
    }
  }

  onFinish = (values) => {
    values.id = this.state.id;
    message.loading(I18n('Processing'));
    Api.query().post({USER_EDIT: values}, (response) => {
      Api.handle(response,
        () => {
          message.success(I18n(['EDIT', 'SUCCESS']));
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
      this.state.info
        ?
        <Form
          ref={this.form}
          initialValues={this.state.info}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          {...layout}
        >
          <Form.Item label={I18n('mobile number')}>
            {this.state.info.mobile}
          </Form.Item>
          <Form.Item name="status" label={I18n('status')} rules={[{required: true}]}>
            <Select
              placeholder={I18n('PLEASE_CHOOSE')}
              options={History.state.mapping.yonna.antd.User_UserStatus}
            />
          </Form.Item>
          <Form.Item
            label={I18n(['LOGIN', 'PASSWORD'])}
            name="password"
            rules={[
              ({getFieldValue}) => ({
                validator(rule, value) {
                  const pwd = getFieldValue('password');
                  if (pwd === undefined || pwd.length < 1) {
                    return Promise.resolve();
                  }
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
          <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
          </Form.Item>
        </Form>
        : <div className="h-react-spin">
          <Spin/>
        </div>
    );
  }
}

export default Edit;