import React, {Component} from 'react';
import {message, Button, Pagination, Table, Popover} from "antd";
import {
  SearchOutlined,
  InsertRowAboveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  MessageOutlined
} from "@ant-design/icons";
import {Api, Confirm, I18n, Moment} from "h-react-antd";
import Filter from "./Filter";
import Field from "./Field";
import Answer from "./Answer";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "feedback_";
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
        title: I18n("content"),
        dataIndex: this.tableName + 'content',
        key: this.tableName + 'content',
        width: '27%',
        render: text => <span style={{wordBreak: 'break-all'}}>{text}</span>,
      },
      {
        title: I18n("answer"),
        dataIndex: this.tableName + 'answer',
        key: this.tableName + 'answer',
        width: '27%',
        render: text => <span style={{wordBreak: 'break-all'}}>{text}</span>,
      },
      {
        title: 'IP',
        dataIndex: this.tableName + 'ip',
        key: this.tableName + 'ip',
      },
      {
        title: I18n(["feedback", "time"]),
        dataIndex: this.tableName + 'feedback_time',
        key: this.tableName + 'feedback_time',
        render: (text) => {
          return Moment.format(text);
        },
      },
      {
        title: I18n(["answer", "time"]),
        dataIndex: this.tableName + 'answer_time',
        key: this.tableName + 'answer_time',
        render: (text) => {
          return text > 0 ? Moment.format(text) : '';
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
              <Confirm onConfirm={() => {
                Api.query().post({FEEDBACK_DEL: {id: record[this.tableName + 'id']}}, (response) => {
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
        <Confirm
          disabled={this.state.querying || this.state.batchKeys.length <= 0}
          onConfirm={() => {
            this.setState({querying: true});
            Api.query().post({FEEDBACK_MDEL: {ids: this.state.batchKeys}}, (response) => {
              this.setState({querying: false});
              Api.handle(response, () => {
                message.success(I18n(['BATCH', 'DELETE', 'SUCCESS']));
                this.query();
              });
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
          title={I18n(['answer', 'content'])}
          content={
            <Answer
              onAnswer={(answer) => {
                this.setState({querying: true});
                Api.query().post({FEEDBACK_MANSWER: {ids: this.state.batchKeys, answer: answer}}, (response) => {
                  this.setState({querying: false});
                  Api.handle(response,
                    () => {
                      message.success(I18n(['BATCH', 'ANSWER', 'SUCCESS']));
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
            icon={<MessageOutlined/>}
            disabled={this.state.querying || this.state.batchKeys.length <= 0}
          >{I18n(['BATCH', 'ANSWER'])}</Button>
        </Popover>
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({FEEDBACK_PAGE: this.filter}, (response) => {
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
