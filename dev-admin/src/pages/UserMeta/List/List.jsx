import React, {Component} from 'react';
import {Button, message, Popover, Table} from 'antd';
import {
  ReloadOutlined,
  InsertRowAboveOutlined,
  PlusOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import {Api, Confirm, History, I18n, Approve} from "h-react-antd";
import Field from "./Field";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "user_meta_category_";
    this.filter = {
      current: 1,
      per: 20,
    };
    this.state = {
      prepare: null,
      fields: null,
      dataSource: [],
      querying: false,
      batchKeys: [],
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
        width: 100,
      },
      {
        title: I18n(["name"]),
        dataIndex: this.tableName + 'label',
        key: this.tableName + 'label',
        render: (text) => {
          return I18n(text);
        },
      },
      {
        title: I18n(["format", "type"]),
        dataIndex: this.tableName + 'value_format',
        key: this.tableName + 'value_format',
        render: (text) => {
          return I18n(History.state.mapping.yonna.value2label.User_MetaValueFormat[text]);
        },
      },
      {
        title: I18n(["default", "value"]),
        dataIndex: this.tableName + 'value_default',
        key: this.tableName + 'value_default',
        render: (text) => {
          if (Array.isArray(text)) {
            return text.length === 0 ? '[]' : `[${text.join(',')}]`;
          }
          return text;
        },
      },
      {
        title: I18n("component"),
        dataIndex: this.tableName + 'component',
        key: this.tableName + 'component',
      },
      {
        title: I18n(["component", "data", "source"]),
        dataIndex: this.tableName + 'component_data',
        key: this.tableName + 'component_data',
      },
      {
        title: I18n("sort"),
        dataIndex: this.tableName + 'sort',
        key: this.tableName + 'sort',
      },
      {
        title: I18n("status"),
        dataIndex: this.tableName + 'status',
        key: this.tableName + 'status',
        render: (text) => {
          return History.state.mapping.yonna.value2label.User_MetaCategoryStatus[text];
        },
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
                History.push('/data/user/meta/edit?key=' + record[this.tableName + 'key']);
              }}>{I18n('EDIT')}</Button>
              <Confirm onConfirm={() => {
                Api.query().post({USER_META_CATEGORY_DEL: {key: record[this.tableName + 'key']}}, (response) => {
                  Api.handle(response,
                    () => {
                      message.success(I18n(['DELETE', 'SUCCESS']));
                      this.query();
                    }
                  );
                });
              }}>
                <Button size="small" danger>{I18n('DELETE')}</Button>
              </Confirm>
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
        <Popover
          trigger="click"
          placement="bottomLeft"
          title={I18n(['FIELD', 'SEARCH'])}
          content={
            <Field
              columns={this.columns()}
              rowKey="title"
              onField={(fields) => {
                this.setState({fields: fields});
              }}
            />
          }
        >
          <Button size="small" icon={<InsertRowAboveOutlined/>}>{I18n(['FIELD', 'SEARCH'])}</Button>
        </Popover>
        <Button
          size="small"
          danger
          icon={<PlusOutlined/>}
          onClick={() => {
            History.push('/data/user/meta/add');
          }}
        >{I18n(['create', 'common', 'data', 'item'])}</Button>
        <Popover
          trigger="click"
          placement="bottomLeft"
          title={I18n(['choose', 'status'])}
          content={
            <Approve
              mapping={History.state.mapping.yonna.antd.User_MetaCategoryStatus}
              onApprove={(status) => {
                this.setState({querying: true});
                Api.query().post({
                  USER_META_CATEGORY_MSTATUS: {
                    keys: this.state.batchKeys,
                    status: status
                  }
                }, (response) => {
                  this.setState({querying: false});
                  Api.handle(response,
                    () => {
                      message.success(I18n(['BATCH', 'APPROVE', 'SUCCESS']));
                      this.query();
                    }
                  );
                });
              }}
            />
          }
        >
          <Button
            size="small"
            danger
            icon={<IssuesCloseOutlined/>}
            disabled={this.state.querying || this.state.batchKeys.length <= 0}
          >{I18n(['BATCH', 'APPROVE'])}</Button>
        </Popover>
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({USER_META_CATEGORY_LIST: this.filter}, (response) => {
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
            rowSelection={{
              selectedRowKeys: this.state.batchKeys,
              onChange: batchKeys => this.setState({batchKeys: batchKeys}),
            }}
          />
        </div>
      </div>
    );
  }
}

export default List;
