import React, {Component} from 'react';
import {Button, message, Table} from 'antd';
import {
  ReloadOutlined,
} from '@ant-design/icons';
import {Api, History, I18n, Parse} from "h-react-antd";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "sdk_";
    this.filter = {
      current: 1,
      per: 20,
    };
    this.state = {
      prepare: null,
      fields: null,
      dataSource: [],
      querying: false,
    }
  }

  componentDidMount() {
    this.query();
  }

  columns = (fields) => {
    const all = [
      {
        title: 'KEY',
        dataIndex: this.tableName + 'key',
        key: this.tableName + 'key',
        width: 200,
      },
      {
        title: I18n("value"),
        dataIndex: this.tableName + 'value',
        key: this.tableName + 'value',
        render: text => Parse.hideString(text, 3, 3)
      },
      {
        title: I18n('operate'),
        dataIndex: this.tableName + 'key',
        key: this.tableName + 'key',
        width: 200,
        render: (text, record, index) => {
          return (
            <div>
              <Button size="small" onClick={() => {
                History.push('/setting/sdk/edit?key=' + record[this.tableName + 'key']);
              }}>{I18n('EDIT')}</Button>
            </div>
          );
        }
      },
    ]
    if (Array.isArray(fields)) {
      const some = [];
      all.forEach((val) => {
        if (fields.includes(val.title)) {
          some.push(val);
        }
      });
      return some;
    } else {
      return all;
    }
  }

  operates = () => {
    return (
      <div className="space">
        <Button
          size="small"
          type="dashed"
          icon={<ReloadOutlined spin={this.state.querying}/>}
          onClick={() => {
            this.query();
          }}
        >{I18n(['REFRESH'])}</Button>
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({SDK_LIST: this.filter}, (response) => {
      this.setState({
        querying: false,
      });
      Api.handle(response,
        () => {
          this.setState({
            dataSource: response.data || [],
          });
        }
      );
    });
  }

  render() {
    return (
      <div className="h-react-list">
        <div className="space-operate">
          {this.operates()}
        </div>
        <div className="space-list">
          <Table
            bordered
            size="middle"
            loading={this.state.querying}
            rowKey={this.tableName + 'key'}
            dataSource={this.state.dataSource}
            columns={this.columns(this.state.fields)}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default List;
