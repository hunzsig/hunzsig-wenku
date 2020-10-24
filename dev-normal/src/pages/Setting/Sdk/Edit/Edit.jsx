import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select, Spin, DatePicker} from 'antd';
import {Api, I18n, Braft, Parse, History, Moment} from 'h-react-antd';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.state = {
      key: this.search.key,
      info: null,
    }
  }

  componentDidMount() {
    if (this.state.key) {
      Api.query().post({SDK_INFO: {key: this.state.key}}, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data, 'sdk_');
            info.value = '';
            this.setState({
              info: info,
            });
          }
        );
      });
    }
  }

  onFinish = (values) => {
    values.key = this.state.key;
    message.loading(I18n('Processing'));
    Api.query().post({SDK_EDIT: values}, (response) => {
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
          <Form.Item name="key" label="key" rules={[{required: true}]}>
            <Input disabled allowClear={true}/>
          </Form.Item>
          <Form.Item name="value" label="value" rules={[{required: true}]}>
            <Input allowClear={true}/>
          </Form.Item>
          <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
          </Form.Item>
        </Form>
        :
        <div className="h-react-spin">
          <Spin/>
        </div>
    );
  }
}

export default Edit;