import React, {Component} from 'react';
import {message, Form, Input, Checkbox, Button, Row, Col} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {Api, I18n, Parse} from 'h-react-antd';

class Add extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.initialValues = {
      name: '',
      allow_scope: [],
    };
    this.checkAll = false;
    this.state = {
      checked: [],
      scopes: [],
      processing: false,
    }
  }

  componentDidMount() {
    if (this.search.upper_id) {
      Api.query().post({LICENSE_SCOPES: {id: this.search.upper_id}}, (response) => {
        Api.handle(response,
          () => {
            this.setState({
              scopes: response.data,
            });
          }
        );
      });
    }
  }

  onFinish = (values) => {
    values.upper_id = this.search.upper_id;
    if (values.allow_scope.includes('all')) {
      const tmp = [];
      values.allow_scope.forEach((val) => {
        val !== 'all' && tmp.push(val);
      });
      values.allow_scope = tmp;
    }
    message.loading(I18n('Processing'));
    Api.query().post({LICENSE_ADD: values}, (response) => {
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
        <Form.Item name="name" label={I18n(['license', 'name'])} rules={[{required: true}]}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item
          name="allow_scope"
          label={I18n("allow") + 'scope'}
        >
          {
            this.state.scopes.length <= 0
              ?
              <LoadingOutlined/>
              :
              <Checkbox.Group onChange={(values) => {
                let tmp = [];
                if (values.includes('all')) {
                  if (!this.checkAll) {
                    this.checkAll = true;
                    tmp = ['all'];
                    this.state.scopes.forEach((val) => {
                      tmp.push(val);
                    });
                  } else if (this.checkAll && values.length <= this.state.scopes.length) {
                    this.checkAll = false;
                    tmp = [];
                    values.forEach((val) => {
                      val !== 'all' && tmp.push(val);
                    });
                  }
                } else if (!values.includes('all') && this.checkAll) {
                  this.checkAll = false;
                  tmp = [];
                } else if (values.length === this.state.scopes.length) {
                  this.checkAll = true;
                  tmp = ['all'];
                  this.state.scopes.forEach((val) => {
                    tmp.push(val);
                  });
                } else {
                  tmp = values;
                }
                this.form.current.setFieldsValue({allow_scope: tmp});
              }}>
                <Row>
                  <Col span={24}><Checkbox value="all">{I18n('all')}</Checkbox></Col>
                  {this.state.scopes.map((val) => {
                    return <Col key={val} span={12}>
                      <Checkbox value={val} checked={this.state.checked.includes(val)}>{val}</Checkbox>
                    </Col>
                  })}
                </Row>
              </Checkbox.Group>
          }
        </Form.Item>
        <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Add;