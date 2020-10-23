import React, {Component} from 'react';
import {message, Form, Input, Button, Select, Spin, Alert} from 'antd';
import {Api, I18n, Parse, History} from 'h-react-antd';

class Account extends Component {
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
      Api.query().post({USER_ACCOUNT_INFO: {id: this.state.id}}, (response) => {
        const info = Parse.removeTable(response.data, 'user_account_');
        this.setState({
          info: info,
        });
      });
    }
  }

  onFinish = (values) => {
    values.id = this.state.id;
    message.loading(I18n('Processing'));
    Api.query().post({USER_ACCOUNT_EDIT: values}, (response) => {
      Api.handle(response,
        () => message.success(I18n(['SAVE', 'SUCCESS']))
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
          <Form.Item name="string" label={I18n(['account', 'string'])} rules={[{required: true}]}>
            <Input allowClear={true}/>
          </Form.Item>
          <Form.Item name="type" label={I18n(['account', 'type'])} rules={[{required: true}]}>
            <Select
              placeholder={I18n('PLEASE_CHOOSE')}
              options={History.state.mapping.yonna.antd.User_AccountType}
            />
          </Form.Item>
          <Form.Item name="allow_login" label={I18n(['allow', 'login'])} rules={[{required: true}]}>
            <Select
              placeholder={I18n('PLEASE_CHOOSE')}
              options={History.state.mapping.yonna.antd.Common_Boolean}
            />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Alert showIcon type="info" message={I18n('ALLOW_LOGIN_ALERT')}/>
          </Form.Item>
          <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
          </Form.Item>
        </Form>
        :
        <Spin/>
    )
      ;
  }
}

export default Account;