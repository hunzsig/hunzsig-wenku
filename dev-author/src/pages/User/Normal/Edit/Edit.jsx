import React, {Component} from 'react';
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
  XossUploadImage, XossUploadImageCrop
} from 'h-react-antd';
import * as moment from "moment";

class Edit extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.form = React.createRef();
    this.state = {
      id: this.search.id,
      info: null,
      metaCategory: [],
    }
  }

  componentDidMount() {
    if (this.state.id) {
      Api.query().post({
        USER_META_CATEGORY_LIST: {status: 1, bind_data: true},
        USER_INFO: {id: this.state.id},
      }, (response) => {
        Api.handle(response,
          () => {
            const metaCategory = Parse.removeTable(response.data.USER_META_CATEGORY_LIST, 'user_meta_category_');
            const info1 = Parse.removeTable(response.data.USER_INFO, 'user_meta_');
            const info = Parse.removeTable(info1, 'user_');
            info.mobile = '?';
            for (let i in info.account) {
              if (info.account[i].user_account_type === 'phone') {
                info.mobile = info.account[i].user_account_string;
                break;
              }
            }
            if (!info.region) {
              info.region = ["2614", "2665", "2666"];//东莞
            }
            metaCategory.forEach((obj) => {
              if (!info[obj.key]) {
                if (obj.value_default !== '') {
                  info[obj.key] = obj.value_default;
                } else {
                  info[obj.key] = undefined;
                }
              } else {
                switch (obj.component) {
                  case 'range_picker_date':
                  case 'range_picker_datetime':
                  case 'range_picker_time':
                    info[obj.key][0] = Moment.create(info[obj.key][0]);
                    info[obj.key][1] = Moment.create(info[obj.key][1]);
                    break;
                  case 'picker_date':
                  case 'picker_datetime':
                  case 'picker_time':
                  case 'picker_week':
                  case 'picker_month':
                  case 'picker_quarter':
                    info[obj.key] = Moment.create(info[obj.key]);
                    break;
                  default:
                    break;
                }
              }
            });
            this.setState({
              metaCategory: metaCategory,
              info: info,
            });
          }
        );
      });
    }
  }

  onFinish = (values) => {
    message.loading(I18n('Processing'));
    const v = {
      id: this.state.id,
      status: values.status,
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
    Api.query().post({USER_EDIT: v}, (response) => {
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
      this.state.info && this.state.metaCategory.length > 0
        ?
        <Form
          ref={this.form}
          initialValues={this.state.info}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          {...layout}
        >
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
    );
  }
}

export default Edit;