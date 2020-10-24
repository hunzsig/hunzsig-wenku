import React, {Component} from 'react';
import {Form, Input, Button, DatePicker} from 'antd';
import {History, I18n, Parse} from 'h-react-antd';
import * as moment from "moment";

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
      if (i === 'feedback_time' || i === 'answer_time') {
        values[i] = [values[i][0].unix().valueOf(), values[i][1].unix().valueOf()]
      }
    }
    this.props.onFilter(values);
  };

  onClear = () => {
    this.form.current.setFieldsValue({
      id: undefined,
      content: undefined,
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
        <Form.Item name="content" label={I18n('content')}>
          <Input allowClear={true}/>
        </Form.Item>
        <Form.Item name="feedback_time" label={I18n(["feedback", "time"])}>
          <DatePicker.RangePicker
            locale={History.i18nAntd()}
            showTime={{format: 'HH:mm'}}
            format="YYYY-MM-DD HH:mm:00"
            ranges={{
              [I18n('Today')]: [moment(), moment()],
              [I18n(['This', 'Month'])]: [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        </Form.Item>
        <Form.Item name="answer_time" label={I18n(["answer", "time"])}>
          <DatePicker.RangePicker
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