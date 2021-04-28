import {Input, Button, Form, DatePicker} from 'antd';
import * as moment from 'moment';
import {I18n, Parse, History} from 'h-react-antd';

const {RangePicker} = DatePicker;

export default (props) => {

  const params = {};
  for (let i in props.params) {
    if (!props.params[i] || i === 'logging_id') {
      continue;
    }
    if (i === 'log_time') {
      params[i] = [moment.unix(props.params[i][0]), moment.unix(props.params[i][1])];
    } else {
      params[i] = props.params[i];
    }
  }

  const [form] = Form.useForm();

  const onSearch = values => {
    let log_time;
    if (values.log_time) {
      log_time = values.log_time[0].unix().valueOf() + ',' + values.log_time[1].unix().valueOf()
    }
    const data = {
      ...params,
      key: values.key,
      type: values.type,
      log_time: log_time
    };
    history.replaceState(data, document.title, Parse.urlEncode(data));
    props.onFilter(data);
  };

  const onClear = () => {
    const data = {
      ...params,
      key: '',
      type: '',
      log_time: '',
    };
    form.setFieldsValue(data);
    history.replaceState(data, document.title, Parse.urlEncode(data));
    props.onFilter(data);
  };

  return (
    <Form
      className="h-react-filter"
      form={form}
      name="log-db"
      initialValues={params}
      onFinish={onSearch}
    >
      <Form.Item name="key" label={I18n("source")}>
        <Input allowClear={true}/>
      </Form.Item>
      <Form.Item name="type" label={I18n("type")}>
        <Input allowClear={true}/>
      </Form.Item>
      <Form.Item name="log_time" label={I18n("time")}>
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
      <Form.Item style={{textAlign: 'center'}}>
        <Button onClick={onClear}>{I18n('CLEAR')}</Button>
        <Button type="primary" htmlType="submit">{I18n('SEARCH')}</Button>
      </Form.Item>
    </Form>
  );

};