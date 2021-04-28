import React, {Component} from 'react';
import nanoid from 'nanoid';
import {
  message, Form,
  Input, Button,
  Select, InputNumber,
  DatePicker, TimePicker,
  Cascader, Spin,
  Checkbox, Radio, Col, Row,
} from 'antd';
import {
  Api,
  I18n,
  History,
  Parse,
  CascaderRegion,
  CascaderProvincial,
  CascaderMunicipal,
  Moment,
  XossUploadImage,
  XossUploadImageCrop
} from 'h-react-antd';
import * as moment from "moment";

class Add extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.initialValues = {
      status: 1,
      region: ["2614", "2665", "2666"],//东莞
    };
    this.state = {
      processing: false,
      metaCategory: [],
    }
  }

  componentDidMount() {
    Api.query().post({USER_META_CATEGORY_LIST: {status: 1, bind_data: true}}, (response) => {
      Api.handle(response,
        () => {
          const metaCategory = Parse.removeTable(response.data, 'user_meta_category_');
          metaCategory.forEach((obj) => {
            if (!this.initialValues[obj.key]) {
              if (obj.value_default !== '') {
                this.initialValues[obj.key] = obj.value_default;
              } else {
                this.initialValues[obj.key] = undefined;
              }
            }
          });
          this.setState({
            metaCategory: metaCategory,
          });
        }
      );
    });
  }

  onFinish = (values) => {
    message.loading(I18n('Processing'));
    const v = {
      status: values.status,
      licenses: [4],
      password: values.password,
      accounts: {
        [values.login_name]: 'name',
      },
      metas: {},
    };
    this.state.metaCategory.forEach((obj) => {
      let objv = values[obj.key] ? values[obj.key] : null;
      if (objv) {
        switch (obj.component) {
          case 'range_picker_date':
          case 'range_picker_datetime':
          case 'range_picker_time':
            objv[0] = Moment.unix(objv[0]);
            objv[1] = Moment.unix(objv[1]);
            break;
          case 'picker_date':
          case 'picker_datetime':
          case 'picker_time':
          case 'picker_week':
          case 'picker_month':
          case 'picker_quarter':
            objv = Moment.unix(objv);
            break;
          default:
            break;
        }
      }
      v.metas[obj.key] = objv;
    });
    Api.query().post({USER_ADD: v}, (response) => {
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

  renderItem = (obj) => {
    let item = null;
    switch (obj.component) {
      case 'input_string':
        item = <Input allowClear={true}/>;
        break;
      case 'input_password':
        item = <Input.Password allowClear={true}/>;
        break;
      case 'input_number':
        item = <InputNumber allowClear={true}/>;
        break;
      case 'range_picker_date':
        item = (
          <DatePicker.RangePicker
            locale={History.i18nAntd()}
            format="YYYY-MM-DD"
            ranges={{
              [I18n('Today')]: [moment(), moment()],
              [I18n(['This', 'Month'])]: [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        );
        break;
      case 'range_picker_datetime':
        item = (
          <DatePicker.RangePicker
            locale={History.i18nAntd()}
            showTime={{format: 'HH:mm'}}
            format="YYYY-MM-DD HH:mm:00"
            ranges={{
              [I18n('Today')]: [moment(), moment()],
              [I18n(['This', 'Month'])]: [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        );
        break;
      case 'range_picker_time':
        item = <TimePicker.RangePicker locale={History.i18nAntd()} format="HH:mm:ss"/>;
        break;
      case 'picker_date':
        item = <DatePicker locale={History.i18nAntd()} showToday={true}/>;
        break;
      case 'picker_datetime':
        item = <DatePicker locale={History.i18nAntd()} showToday={true} showTime={{format: 'HH:mm'}}/>;
        break;
      case 'picker_time':
        item = <TimePicker locale={History.i18nAntd()} showNow={true}/>;
        break;
      case 'picker_week':
        item = <DatePicker.WeekPicker locale={History.i18nAntd()}/>;
        break;
      case 'picker_month':
        item = <DatePicker.MonthPicker locale={History.i18nAntd()}/>;
        break;
      case 'picker_quarter':
        item = <DatePicker.QuarterPicker locale={History.i18nAntd()}/>;
        break;
      case 'cascader':
        item = <Cascader/>;
        break;
      case 'cascader_region':
        item = <CascaderRegion/>;
        break;
      case 'cascader_provincial':
        item = <CascaderProvincial/>;
        break;
      case 'cascader_municipal':
        item = <CascaderMunicipal/>;
        break;
      case 'select':
        item = <Select options={obj.component_data}/>;
        break;
      case 'checkbox':
        item = (
          <Checkbox.Group style={{width: '100%'}}>
            <Row>
              {
                obj.component_data.map((o) => {
                  return (
                    <Col key={o.value} span={24}>
                      <Checkbox value={o.value}>{o.label}</Checkbox>
                    </Col>
                  );
                })
              }
            </Row>
          </Checkbox.Group>
        );
        break;
      case 'radio':
        item = <Radio.Group options={obj.component_data}/>;
        break;
      case 'xoss_upload_image':
        item = <XossUploadImage/>;
        break;
      case 'xoss_upload_image_crop':
        item = <XossUploadImageCrop/>;
        break;
      default:
        break;
    }
    return item;
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
          this.state.metaCategory.length > 0
            ?
            <Form
              ref={this.form}
              initialValues={this.initialValues}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              {...layout}
            >
              <Form.Item
                label={I18n(['LOGIN', 'PASSWORD'])}
                name="password"
                rules={[
                  {required: true},
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
                  })
                ]}
              >
                <Input.Password
                  placeholder={I18n(['PLEASE_INPUT', 'LOGIN', 'PASSWORD'])}
                  allowClear={true}
                />
              </Form.Item>
              <Form.Item name="login_name" label={I18n(['user', 'name'])} rules={[{required: true}]}>
                <Input allowClear={true}/>
              </Form.Item>
              <Form.Item name="status" label={I18n('status')} rules={[{required: true}]}>
                <Select
                  placeholder={I18n('PLEASE_CHOOSE')}
                  options={History.state.mapping.yonna.antd.User_UserStatus}
                />
              </Form.Item>
              {
                this.state.metaCategory.map((obj, idx) => {
                  return (
                    <Form.Item
                      key={obj.key}
                      name={obj.key}
                      label={I18n(obj.label)}
                    >
                      {this.renderItem(obj)}
                    </Form.Item>
                  );
                })
              }
              <Form.Item label=" " colon={false} style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" disabled={this.state.processing}>{I18n('SUBMIT')}</Button>
              </Form.Item>
            </Form>
            :
            <div className="h-react-spin">
              <Spin/>
            </div>
        }
      </div>
    );
  }
}

export default Add;