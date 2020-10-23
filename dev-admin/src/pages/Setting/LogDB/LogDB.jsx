import "./LogDB.less";
import React, {Component} from 'react';
import {Table, Pagination, Popover, Button} from 'antd';
import ReactJson from 'react-json-view'
import {Api, I18n, Parse, Moment} from 'h-react-antd';
import {SearchOutlined, ReloadOutlined, InsertRowAboveOutlined} from "@ant-design/icons";
import Filter from "./Filter";
import Field from "./Field";

class LogDB extends Component {

  constructor(props) {
    super(props);

    const search = Parse.urlSearch(props);

    this.tableName = "log_";
    this.filter = {
      current: 1,
      per: 20,
    };

    this.state = {
      fields: null,
      querying: false,
      dataSource: [],
      pagination: null,
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
        width: '100px',
      },
      {
        title: I18n(["record", "time"]),
        dataIndex: this.tableName + 'record_time',
        key: this.tableName + 'record_time',
        render: (txt) => {
          return Moment.format(txt);
        }
      },
      {
        title: I18n("source"),
        dataIndex: this.tableName + 'key',
        key: this.tableName + 'key',
      },
      {
        title: I18n("type"),
        dataIndex: this.tableName + 'type',
        key: this.tableName + 'type',
      },
      {
        width: "50%",
        title: I18n("data"),
        dataIndex: this.tableName + 'data',
        key: this.tableName + 'data',
        render: (txt) => <ReactJson src={txt} collapsed={true}/>
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
          placement="bottomLeft"
          title={I18n(['CONDITION', 'SEARCH'])}
          content={
            <Filter onFilter={(filter) => {
              this.filter = {...this.filter, ...filter};
              this.filter.current = 1;
              this.query();
            }}/>
          }
          trigger="click"
        >
          <Button
            size="small"
            type="primary"
            icon={<SearchOutlined/>}
            onClick={() => {
              this.setState({modalConditionSearch: true});
            }}
          >{I18n(['CONDITION', 'SEARCH'])}</Button>
        </Popover>
        <Popover
          trigger="click"
          placement="bottomLeft"
          title={I18n(['CONDITION', 'SEARCH'])}
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
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({LOG_DB: this.filter}, (res) => {
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
  };

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

export default LogDB;
