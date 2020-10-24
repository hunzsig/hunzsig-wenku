import React, {Component} from 'react';
import {Form, Input, Button, Select, DatePicker} from 'antd';
import {History, I18n, Parse} from 'h-react-antd';
import * as moment from "moment";

const {RangePicker} = DatePicker;

class Filter extends Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();

    this.search = Parse.urlSearch();
  }

  onFinish = values => {
    for (let i in values) {
      if (!values[i]) {
        values[i] = undefined;
      }
      if (i === 'register_time' && typeof time === 'object') {
        const time = values[i];
        values[i] = [time[0].unix().valueOf(), time[1].unix().valueOf()];
      }
    }
    console.log(values);
    this.props.onFilter(values);
  };

  onClear = () => {
    this.form.current.setFieldsValue({
      id: undefined,
      status: undefined,
      register_time: undefined,
      account: undefined,
    });
  };

  render() {
    const layout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    }
    return (
      <Form
        {...layout}
        className="h-react-filter"
        ref={this.form}
        initialValues={this.search}
        onFinish={this.onFinish}
      >
        <Form.Item name="id" label="ID">
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="status" label={I18n('status')}>
          <Select
            allowClear
            placeholder={I18n('PLEASE_CHOOSE')}
            options={History.state.mapping.yonna.antd.User_UserStatus}
          />
        </Form.Item>
        <Form.Item name="account" label={I18n('account')}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="register_time" label={I18n(["register", "time"])}>
          <RangePicker
            locale={History.i18nAntd()}
            showTime={{format: 'HH:mm'}}
            format="YYYY-MM-DD HH:mm:00"
            ranges={{
              [I18n('Today')]: [moment(), moment()],
              [I18n(['This', 'Month'])]: [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        </Form.Item>
        <Form.Item style={{textAlign: 'right'}}>
          <Button onClick={this.onClear}>{I18n('CLEAR')}</Button>
          <Button type="primary" htmlType="submit">{I18n('SEARCH')}</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Filter;