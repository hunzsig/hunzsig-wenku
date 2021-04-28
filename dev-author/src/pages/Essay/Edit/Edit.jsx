import React, {Component} from 'react';
import {message, Form, Input, InputNumber, Button, Select, Spin, DatePicker, Alert} from 'antd';
import {Api, I18n, Braft, Parse, History, Moment} from 'h-react-antd';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.state = {
      id: this.search.id,
      category: [],
      info: null,
    }
  }

  componentDidMount() {
    if (this.state.id) {
      Api.query().post({
        AUTHOR_ESSAY_CATEGORY_LIST: {},
        AUTHOR_ESSAY_INFO: {id: this.state.id}
      }, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data.AUTHOR_ESSAY_INFO, 'essay_');
            info.publish_time = Moment.create(info.publish_time);
            this.setState({
              category: response.data.AUTHOR_ESSAY_CATEGORY_LIST,
              info: info,
            });
          },
        );
      });
    }
  }

  onFinish = (values) => {
    values.id = this.state.id;
    values.publish_time = values.publish_time ? Moment.unix(values.publish_time) : null;
    message.loading(I18n('Processing'));
    Api.query().post({AUTHOR_ESSAY_EDIT: values}, (response) => {
      Api.handle(response,
        () => message.success(I18n(['EDIT', 'SUCCESS'])),
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
      <div>
        {
          this.state.info ? <div>
              <Alert message="更新后状态会变回待审核，请确定好当前管理员是否在线！谨慎操作！" type="warning" showIcon/>
              <br/>
              <Form
                ref={this.form}
                initialValues={this.state.info}
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
                        return <Select.Option
                          key={idx}
                          value={obj.essay_category_id}
                        >{obj.essay_category_name}</Select.Option>;
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
                  <Braft
                    // defaultValue={this.state.info.content}
                    onChange={(value) => {
                      return value;
                    }}
                  />
                </Form.Item>
                <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
                  <Button type="primary" htmlType="submit">{I18n('SUBMIT')}</Button>
                </Form.Item>
              </Form>
              : <Spin/>
            </div>
            : <Spin/>
        }
      </div>
    );
  }
}

export default Edit;