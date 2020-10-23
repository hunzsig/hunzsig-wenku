import React, {Component} from 'react';
import {message, Button, Table, Popover, Modal, Pagination, Input} from "antd";
import {
  SearchOutlined,
  InsertRowAboveOutlined,
  ReloadOutlined,
  EditOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import {Api, History, I18n} from "h-react-antd";
import Field from "./Field";
import I18nForm from "./form";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "i18n_";
    this.state = {
      fields: null,
      dataSource: [],
      pagination: null,
      querying: false,
      backuping: false,
      visible: false,
      uniqueInfo: {},
      //
      searchText: '',
      searchedColumn: '',
    }
  }

  componentDidMount() {
    this.query();
  }

  columns = (fields) => {
    const all = [
      {
        width: 300,
        title: I18n('UNIQUE_KEY'),
        dataIndex: this.tableName + 'unique_key',
        key: this.tableName + 'unique_key',
        ...this.filterDropdown(this.tableName + 'unique_key'),
        render: (text, record) => {
          return (
            <Button icon={<EditOutlined/>} onClick={() => {
              const info = {};
              for (let r in record) {
                info[r.replace(this.tableName, '')] = record[r];
              }
              this.setState({
                uniqueInfo: info,
                visible: true,
              });
            }}>
              {text.length > 25 ? text.substr(0, 25) + '...' : text}
            </Button>);
        },
      },
    ];
    History.state.i18n.support.forEach((v) => {
      all.push({
        title: v,
        dataIndex: this.tableName + v,
        key: this.tableName + v,
        ellipsis: true,
        ...this.filterDropdown(this.tableName + v),
      });
    });
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
          type="default"
          size="small"
          danger
          icon={<CloudServerOutlined/>}
          onClick={() => {
            this.setState({backuping: true})
            Api.query().post({I18N_BACKUP: {}}, (res) => {
              this.setState({backuping: false})
              Api.handle(res,
                () => message.success(I18n(['BACKUP', 'SUCCESS']))
              );
            })
          }}
          loading={this.state.backuping}
          disabled={this.state.backuping}
        >
          {I18n(['BACKUP', 'TRANSLATE', 'DATA'])}
        </Button>
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({I18N_ALL: {}}, (res) => {
      this.setState({
        querying: false,
      });
      Api.handle(res,
        () => {
          const data = res.data || [];
          this.setState({
            dataSource: data,
            pagination: {
              current: 1,
              per: 10,
              total: data.length,
            }
          });
        }
      );
    });
  }

  filterDropdown = (dataIndex) => {

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
      })
    };

    const handleReset = clearFilters => {
      clearFilters();
      this.setState({
        searchText: '',
      })
    };

    let searchInput = null;

    return {
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
          <Input
            ref={node => {
              searchInput = node;
            }}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{width: 188, marginBottom: 8, display: 'block'}}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90, marginRight: 8}}
          >
            {I18n('SEARCH')}
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
            {I18n('RESET')}
          </Button>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#e04240' : undefined}}/>,
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.select());
        }
      },
    };
  };

  render() {
    return (
      <div className="h-react-list">
        <div className="space-operate">
          {this.operates()}
        </div>
        <Modal
          title={I18n('TRANSLATE') + this.state.uniqueInfo.unique_key}
          visible={this.state.visible}
          footer={null}
          onOk={() => {
            this.setState({
              uniqueInfo: {},
              visible: false,
            });
          }}
          onCancel={() => {
            this.setState({
              uniqueInfo: {},
              visible: false,
            });
          }}
        >
          {
            this.state.uniqueInfo.unique_key && <I18nForm data={this.state.uniqueInfo} callback={() => {
              this.setState({
                visible: false,
              })
              this.query();
            }}/>
          }
        </Modal>
        <div className="space-list">
          <Table
            bordered
            size="middle"
            loading={this.state.querying}
            rowKey={this.tableName + 'unique_key'}
            dataSource={this.state.dataSource}
            columns={this.columns(this.state.fields)}
            pagination={{
              size: 'default',
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => I18n("TOTAL") + ' ' + total + ' ' + I18n("ITEMS"),
              position: ["bottomCenter"],
            }}
          />
        </div>
      </div>
    );
  }
}

export default List;
