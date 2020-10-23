import React, {Component} from 'react';
import {Button, message, Table, Modal} from 'antd';
import {ReloadOutlined, PlusOutlined} from '@ant-design/icons';
import {Api, Confirm, History, I18n} from "h-react-antd";
import Help from "h-react-antd/Setting/Help";

class List extends Component {
  constructor(props) {
    super(props);

    this.tableName = "license_";
    this.state = {
      prepare: null,
      fields: null,
      dataSource: [],
      querying: false,
      licenseVisible: {}
    }
  }

  componentDidMount() {
    this.query();
  }

  columns = (fields) => {
    const all = [
      {
        title: I18n(["license", "name"]),
        dataIndex: this.tableName + 'name',
        key: this.tableName + 'name',
        width: 240,
      },
      {
        title: I18n("allow") + 'scope',
        dataIndex: this.tableName + 'allow_scope',
        key: this.tableName + 'allow_scope',
        render: (text, record, index) => {
          return (
            <div>
              {
                record[this.tableName + 'name'] !== 'ROOT' &&
                <div>
                  {I18n('total')}[{text.length}]{I18n('permission')}
                  {
                    text.length > 0 &&
                    <Button
                      type="link"
                      onClick={() => {
                        this.state.licenseVisible[record[this.tableName + 'id']] = true;
                        this.setState({licenseVisible: this.state.licenseVisible})
                      }}>
                      {I18n('show')}
                    </Button>
                  }
                </div>
              }
              {
                text.length > 0 &&
                <Modal
                  title={text.length + I18n('permission')}
                  visible={this.state.licenseVisible[record[this.tableName + 'id']] || false}
                  onOk={() => {
                    this.state.licenseVisible[record[this.tableName + 'id']] = false;
                    this.setState({licenseVisible: this.state.licenseVisible})
                  }}
                  onCancel={() => {
                    this.state.licenseVisible[record[this.tableName + 'id']] = false;
                    this.setState({licenseVisible: this.state.licenseVisible})
                  }}
                >
                  {
                    text.map((val, idx) => {
                      return <div key={idx}>{val}</div>;
                    })
                  }
                </Modal>
              }
            </div>
          );
        }
      },
      {
        title: I18n('operate'),
        dataIndex: this.tableName + 'id',
        key: this.tableName + 'id',
        width: '50%',
        render: (text, record, index) => {
          if (record[this.tableName + 'name'] === 'ROOT') {
            return (
              <div>
                <Help title={I18n('Belongs to this license')}>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined/>}
                    onClick={() => {
                      History.push('/permission/add?upper_id=' + record[this.tableName + 'id']);
                    }}
                  >{I18n(['create', 'next level', 'license'])}</Button>
                </Help>
              </div>
            );
          }
          return (
            <div>
              <Help title={I18n('Belongs to this license')}>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined/>}
                  onClick={() => {
                    History.push('/permission/add?upper_id=' + record[this.tableName + 'id']);
                  }}
                >{I18n(['create', 'next level', 'license'])}</Button>
              </Help>
              <Button
                size="small"
                onClick={() => {
                  History.push('/permission/edit?id=' + record[this.tableName + 'id']);
                }}
              >{I18n('EDIT')}</Button>
              <Confirm onConfirm={() => {
                Api.query().post({LICENSE_DEL: {id: record[this.tableName + 'id']}}, (response) => {
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
      </div>
    );
  }

  query = () => {
    this.setState({
      querying: true,
    });
    Api.query().post({LICENSE_TREE: {}}, (res) => {
      this.setState({
        querying: false,
      });
      Api.handle(res,
        () => {
          this.setState({
            dataSource: res.data || [],
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
            defaultExpandAllRows={true}
            loading={this.state.querying}
            rowKey={this.tableName + 'name'}
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
