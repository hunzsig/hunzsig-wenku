import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select, DatePicker} from 'antd';
import {Api, I18n, Braft, History} from 'h-react-antd';
import Moment from "h-react-antd/Moment";

class Add extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      publish_time: Moment.create(),
      sort: 0,
      is_excellent: -1,
    };
    this.state = {
      processing: true,
      category: [],
    }
  }

  componentDidMount() {
    Api.query().post({AUTHOR_ESSAY_CATEGORY_LIST: {}}, (response) => {
      Api.handle(response,
        () => {
          this.setState({
            category: response.data,
            processing: false,
          });
        },
      );
    });
  }

  onFinish = (values) => {
    values.publish_time = values.publish_time ? Moment.unix(values.publish_time) : null;
    message.loading(I18n('Processing'));
    Api.query().post({AUTHOR_ESSAY_ADD: values}, (response) => {
      Api.handle(response,
        () => {
          message.success(I18n(['ADD', 'SUCCESS']));
          this.form.current.resetFields();
        },
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
        <Form.Item
          name="category_id"
          label={I18n('CATEGORY')}
          rules={[{required: true}]}
        >
          <Select
            showSearch
            placeholder={I18n('PLEASE_CHOOSE')}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              this.state.category.map((obj, idx) => {
                return <Select.Option key={idx} value={obj.essay_category_id}>{obj.essay_category_name}</Select.Option>;
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name="is_excellent" label={I18n('excellent')}>
          <Select
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.Common_Boolean}
          />
        </Form.Item>
        <Form.Item name="title" label={I18n('title')} rules={[{required: true}]}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="publish_time" label={I18n(['publish', 'date'])}>
          <DatePicker/>
        </Form.Item>
        <Form.Item name="sort" label={I18n('sort')}>
          <InputNumber min={0} max={99999} allowClear={true}/>
        </Form.Item>
        <Form.Item
          name="content"
          label={I18n('content')}
          normalize={(value) => {
            return value;
          }}
        >
          <Braft/>
        </Form.Item>
        <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Add;