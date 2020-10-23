import React, {useState} from "react";
import {message, Form, Input, Button} from 'antd';
import {Api, I18n} from 'h-react-antd';

export default (props) => {

  const [formData] = useState(props.data);
  const [querying, setQuerying] = useState(false);

  const layout = {
    labelCol: {
      span: 0,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const
    tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 24,
      },
    };

  const onFinish = values => {
    console.log('Success:', values);
    if (querying === true) {
      return;
    }
    setQuerying(true);
    Api.query().post({I18N_SET: values}, (res) => {
      setQuerying(false);
      Api.handle(res,
        () => {
          message.success(I18n('SUCCESS'));
          props.callback();
        }
      );
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="i18n"
      initialValues={formData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {
        Object.entries(formData).map((v) => {
          if (v[0] === '_id') {
            return null;
          }
          return (
            <Form.Item
              key={v[0]}
              name={v[0]}
              rules={[
                {
                  required: true,
                  message: I18n(['PLEASE_INPUT', 'YOUR']) + v[0] + '!',
                },
              ]}
            >
              <Input addonBefore={v[0]} name={v[0]} allowClear={true}/>
            </Form.Item>
          );
        })
      }
      <Form.Item {...tailLayout}>
        <Button
          style={{width: '100%'}}
          htmlType="submit"
          disabled={querying}
          type={querying ? 'normal' : 'primary'}
          loading={querying}
        >
          {querying ? I18n('LOADING') : I18n('SAVE')}
        </Button>
      </Form.Item>
    </Form>
  );
};