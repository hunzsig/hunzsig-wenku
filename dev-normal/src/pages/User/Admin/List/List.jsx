import React, {Component} from 'react';
import {message, Button, Pagination, Table, Popover, Tag} from "antd";
import {
  SearchOutlined,
  InsertRowAboveOutlined,
  AppstoreAddOutlined,
  ReloadOutlined,
  IssuesCloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {Api, Confirm, History, I18n, Approve, Moment} from "h-react-antd";
import Filter from "./Filter";
import Field from "./Field";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "user_";
    this.filter = {
      current: 1,
      per: 20,
      license_id: 2,
    };
    this.state = {
      fields: null,
      dataSource: [],
      pagination: null,
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
        title: 'ID',
        dataIndex: this.tableName + 'id',
        key: this.tableName + 'id',
        width: 100,
      },
      {
        title: I18n(["account"]),
        key: this.tableName + 'user_account_string',
        render: (text, record, index) => {
          const accounts = record[this.tableName + 'account'];
          let color = {
            name: '#54a9e7',
            phone: '#f55353',
            email: '#f55f0f',
            wx_open_id: '#42ab42',
            wx_union_id: '#87d068',
          };
          return (
            <div>
              {
                accounts.map((val, idx) => {
                  const canEdit = ['name', 'email', 'phone'].includes(val.user_account_type);
                  return (<div key={idx}>
                    <Tag color={color[val.user_account_type]}>
                      {History.state.mapping.yonna.value2label.User_AccountType[val.user_account_type]}
                    </Tag>
                    <span>{val.user_account_string}</span>
                    {
                      canEdit &&
                      <Button type="link" onClick={() => {
                        History.push('/user/account?id=' + val.user_account_id);
                      }}><EditOutlined/></Button>
                    }
                  </div>);
                })
              }
            </div>
          );
        },
      },
      {
        title: I18n("status"),
        dataIndex: this.tableName + 'status',
        key: this.tableName + 'status',
        render: (text) => {
          return History.state.mapping.yonna.value2label.User_UserStatus[text];
        },
      },
      {
        title: I18n(["register", "time"]),
        dataIndex: this.tableName + 'register_time',
        key: this.tableName + 'register_time',
        render: (text) => {
          return Moment.format(text);
        },
      },
      {
        title: I18n('operate'),
        dataIndex: this.tableName + 'id',
        key: this.tableName + 'id',
        width: 200,
        render: (text, record, index) => {
          return (
            <div>
              <Button size="small" onClick={() => {
                History.push('/user/admin/edit?id=' + record[this.tableName + 'id']);
              }}>{I18n(['RESET', 'PASSWORD'])}</Button>
              <Confirm onConfirm={() => {
                Api.query().post({USER_DEL: {id: record[this.tableName + 'id']}}, (response) => {
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
    ];
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
          title={I18n(['CONDITION', 'SEARCH'])}
          content={
            <Filter onFilter={(filter) => {
              this.filter = {...this.filter, ...filter};
              this.filter.current = 1;
              this.query();
            }}/>
          }
        >
          <Button size="small" type="primary" icon={<SearchOutlined/>}>
            {I18n(['CONDITION', 'SEARCH'])}
          </Button>
        </Popover>
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
          icon={<AppstoreAddOutlined/>}
          onClick={() => {
            History.push('/user/admin/add');
          }}
        >{I18n(['CREATE', 'ADMINISTRATOR'])}</Button>
        <Popover
          trigger="click"
          placement="bottomLeft"
          title={I18n(['choose', 'status'])}
          content={
            <Approve
              mapping={History.state.mapping.yonna.antd.User_UserStatus}
              onApprove={(status) => {
                this.setState({querying: true});
                Api.query().post({USER_MSTATUS: {ids: this.state.batchKeys, status: status}}, (response) => {
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
    Api.query().post({USER_PAGE: this.filter}, (response,) => {
      this.setState({
        querying: false,
      });
      Api.handle(response,
        () => {
          this.setState({
            dataSource: response.data.list || [],
            pagination: response.data.page
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
            rowKey={this.tableName + 'id'}
            dataSource={this.state.dataSource}
            columns={this.columns(this.state.fields)}
            pagination={false}
            rowSelection={{
              selectedRowKeys: this.state.batchKeys,
              onChange: batchKeys => this.setState({batchKeys: batchKeys}),
            }}
          />
        </div>
        <div className="space-pagination">
          {
            this.state.pagination &&
            <Pagination
              className="pagination"
              showSizeChanger
              showQuickJumper
              defaultCurrent={this.state.pagination.current}
              defaultPageSize={this.state.pagination.per}
              total={this.state.pagination.total}
              showTotal={total => I18n("TOTAL") + total + I18n("ITEMS")}
              onChange={(current, pageSize) => {
                this.filter.current = current;
                this.filter.per = pageSize;
                this.query();
              }}
              onShowSizeChange={(current, pageSize) => {
                this.filter.current = current;
                this.filter.per = pageSize;
                this.query();
              }}
            />
          }
        </div>
      </div>
    );
  }
}

export default List;
