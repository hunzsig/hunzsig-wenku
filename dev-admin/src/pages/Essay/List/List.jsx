import React, {Component} from 'react';
import {Button, message, Pagination, Popover, Table} from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  InsertRowAboveOutlined,
  PlusOutlined,
  DeleteOutlined,
  IssuesCloseOutlined
} from '@ant-design/icons';
import {Api, Confirm, History, I18n, Parse, Approve} from "h-react-antd";
import Filter from "./Filter";
import Field from "./Field";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "essay_";
    this.filter = {
      current: 1,
      per: 20,
    };
    this.state = {
      prepare: null,
      fields: null,
      dataSource: [],
      pagination: null,
      querying: false,
      batchKeys: [],
    }
  }

  componentDidMount() {
    Api.query().post({ESSAY_CATEGORY_LIST: {status: 2}}, (res) => {
      Api.handle(res,
        () => {
          const categoryMapping = [];
          res.data.forEach((val) => {
            categoryMapping.push({value: val.essay_category_id, label: val.essay_category_name});
          });
          this.setState({
            prepare: {
              categoryMapping: categoryMapping
            },
          });
        }
      );
    });
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
        title: I18n("category"),
        dataIndex: this.tableName + 'category_id',
        key: this.tableName + 'category_id',
        render: (text) => {
          return this.state.prepare
            ? Parse.mapLabel(this.state.prepare.categoryMapping, text, 'ESSAY_CATEGORY')
            : '...';
        },
      },
      {
        title: I18n("title"),
        dataIndex: this.tableName + 'title',
        key: this.tableName + 'title',
      },
      {
        title: I18n("likes"),
        dataIndex: this.tableName + 'likes',
        key: this.tableName + 'likes',
      },
      {
        title: I18n("views"),
        dataIndex: this.tableName + 'views',
        key: this.tableName + 'views',
      },
      {
        title: I18n("status"),
        dataIndex: this.tableName + 'status',
        key: this.tableName + 'status',
        render: (text) => {
          return History.state.mapping.yonna.value2label.Essay_EssayStatus[text];
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
                History.push('/essay/edit?id=' + record.essay_id);
              }}>{I18n('EDIT')}</Button>
              <Confirm onConfirm={() => {
                Api.query().post({ESSAY_DEL: {id: record.essay_id}}, (response) => {
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
        {
          this.state.prepare &&
          <Popover
            trigger="click"
            placement="bottomLeft"
            title={I18n(['CONDITION', 'SEARCH'])}
            content={
              <Filter
                prepare={this.state.prepare}
                onFilter={(filter) => {
                  this.filter = {...this.filter, ...filter};
                  this.filter.current = 1;
                  this.query();
                }}
              />
            }
          >
            <Button size="small" type="primary" icon={<SearchOutlined/>}>
              {I18n(['CONDITION', 'SEARCH'])}
            </Button>
          </Popover>
        }
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
            History.push('/essay/add');
          }}
        >{I18n(['CREATE', 'ARTICLE'])}</Button>
        <Confirm
          disabled={this.state.querying || this.state.batchKeys.length <= 0}
          onConfirm={() => {
            this.setState({querying: true});
            Api.query().post({ESSAY_MDEL: {ids: this.state.batchKeys}}, (response) => {
              this.setState({querying: false});
              Api.handle(response,
                () => {
                  message.success(I18n(['BATCH', 'DELETE', 'SUCCESS']));
                  this.query();
                }
              );
            });
          }}>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined/>}
            disabled={this.state.querying || this.state.batchKeys.length <= 0}
          >{I18n(['BATCH', 'DELETE'])}</Button>
        </Confirm>
        <Popover
          trigger="click"
          placement="bottomLeft"
          title={I18n(['choose', 'status'])}
          content={
            <Approve
              mapping={History.state.mapping.yonna.antd.Essay_EssayStatus}
              onApprove={(status) => {
                this.setState({querying: true});
                Api.query().post({ESSAY_MSTATUS: {ids: this.state.batchKeys, status: status}}, (response) => {
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
    Api.query().post({ESSAY_PAGE: this.filter}, (res) => {
      this.setState({
        querying: false,
      });
      Api.handle(res,
        () => {
          this.setState({
            dataSource: res.data.list || [],
            pagination: res.data.page
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
