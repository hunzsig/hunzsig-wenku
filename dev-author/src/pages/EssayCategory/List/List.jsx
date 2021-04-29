import React, {Component} from 'react';
import {message, Button, Pagination, Table, Popover} from "antd";
import {
  SearchOutlined,
  InsertRowAboveOutlined,
  AppstoreAddOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import {Api, Confirm, History, I18n, XossShow} from "h-react-antd";
import Filter from "./Filter";
import Field from "./Field";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "essay_category_";
    this.filter = {
      current: 1,
      per: 20,
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
        title: 'logo',
        dataIndex: this.tableName + 'logo',
        key: this.tableName + 'logo',
        render: (text) => <XossShow width={50} height={50} src={text[0]}/>,
      },
      {
        title: I18n("name"),
        dataIndex: this.tableName + 'name',
        key: this.tableName + 'name',
      },
      {
        title: I18n("status"),
        dataIndex: this.tableName + 'status',
        key: this.tableName + 'status',
        render: (text) => {
          return History.state.mapping.yonna.value2label.Essay_EssayCategoryStatus[text];
        },
      },
      {
        title: I18n('operate'),
        dataIndex: this.tableName + 'id',
        key: this.tableName + 'id',
        width: 300,
        render: (text, record, index) => {
          return (
            <div>
              {
                record.essay_category_status === 2 &&
                <Confirm onConfirm={() => {
                  Api.query().post({AUTHOR_ESSAY_CATEGORY_SHOW: {id: record[this.tableName + 'id']}}, (response) => {
                    Api.handle(response,
                      () => {
                        message.success(I18n('SUCCESS'));
                        this.query();
                      }
                    );
                  });
                }}>
                  <Button type="primary" size="small" icon={<CloudUploadOutlined/>}>{I18n('SHOW')}</Button>
                </Confirm>
              }
              {
                record.essay_category_status === 10 &&
                <Confirm onConfirm={() => {
                  Api.query().post({AUTHOR_ESSAY_CATEGORY_HIDE: {id: record[this.tableName + 'id']}}, (response) => {
                    Api.handle(response,
                      () => {
                        message.success(I18n('SUCCESS'));
                        this.query();
                      }
                    );
                  });
                }}>
                  <Button type="primary" size="small" icon={<CloudDownloadOutlined/>}>{I18n('HIDE')}</Button>
                </Confirm>
              }
              <Button size="small" onClick={() => {
                History.push('/essay/category/edit?id=' + record[this.tableName + 'id']);
              }}>{I18n('EDIT')}</Button>
              <Confirm onConfirm={() => {
                Api.query().post({AUTHOR_ESSAY_CATEGORY_DEL: {id: record[this.tableName + 'id']}}, (response) => {
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
            History.push('/essay/category/add');
          }}
        >{I18n(['CREATE', 'CATEGORY'])}</Button>
        <Confirm
          disabled={this.state.querying || this.state.batchKeys.length <= 0}
          onConfirm={() => {
            this.setState({querying: true});
            Api.query().post({AUTHOR_ESSAY_CATEGORY_MDEL: {ids: this.state.batchKeys}}, (response) => {
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
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({AUTHOR_ESSAY_CATEGORY_PAGE: this.filter}, (response) => {
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
