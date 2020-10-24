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
      Api.query().post({ESSAY_CATEGORY_INFO: {id: this.state.id}}, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data, 'essay_category_');
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
    Api.query().post({ESSAY_CATEGORY_EDIT: values}, (response) => {
      Api.handle(response,
        () => message.success(I18n(['EDIT', 'SUCCESS']))
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
          <Form.Item name="name" label={I18n('name')} rules={[{required: true}]}>
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
            <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
          </Form.Item>
        </Form>
        : <Spin/>
    );
  }
}

export default Edit;