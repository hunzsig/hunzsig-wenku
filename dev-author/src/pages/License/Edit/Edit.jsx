import React, {Component} from 'react';
import {message, Form, Input, Button, Spin, Checkbox, Row, Col} from 'antd';
import {Api, I18n, Parse} from 'h-react-antd';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.checkAll = false;
    this.state = {
      id: this.search.id,
      info: null,
      scopes: [],
    }
  }

  componentDidMount() {
    if (this.state.id) {
      Api.query().post({
        LICENSE_INFO: {
          id: this.state.id,
          "+": {
            LICENSE_SCOPES: {id: 'eq:license_upper_id'},
          }
        }
      }, (response) => {
        Api.handle(response,
          () => {
            const info = Parse.removeTable(response.data, 'license_');
            let allow_scope = info.allow_scope;
            if (info.allow_scope[0] === 'all' || info.allow_scope.length === info['_'].length) {
              this.checkAll = true;
              allow_scope = ['all', ...info['_']];
            }
            this.setState({
              info: {
                id: info.id,
                name: info.name,
                allow_scope: allow_scope,
                upper_id: info.upper_id,
              },
              scopes: info['_'],
            });
          }
        );
      });
    }
  }

  onFinish = (values) => {
    values.id = this.state.id;
    if (values.allow_scope.includes('all')) {
      const tmp = [];
      values.allow_scope.forEach((val) => {
        val !== 'all' && tmp.push(val);
      });
      values.allow_scope = tmp;
    }
    message.loading(I18n('Processing'));
    Api.query().post({LICENSE_EDIT: values}, (response) => {
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
          <Form.Item name="name" label={I18n('name')} rules={[{required: true}]}>
            <Input allowClear={true}/>
          </Form.Item>
          <Form.Item name="allow_scope" label={I18n("allow") + 'scope'}>
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
                  return <Col key={val} span={12}><Checkbox value={val}>{val}</Checkbox></Col>
                })}
              </Row>
            </Checkbox.Group>
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