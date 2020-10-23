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
      category: [],
      info: null,
    }
  }

  componentDidMount() {
    if (this.state.key) {
      Api.query().post({USER_META_CATEGORY_INFO: {key: this.state.key}}, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data, 'user_meta_category_');
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
    Api.query().post({USER_META_CATEGORY_EDIT: values}, (response) => {
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
        : <Spin/>
    );
  }
}

export default Edit;