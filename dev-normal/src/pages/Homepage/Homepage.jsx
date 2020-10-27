import './Homepage.less';
import React, {Component} from 'react';
import {message, Menu, List, Pagination, Space, Tooltip, Button} from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  RedoOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Api, LocalStorage, Parse, XossShow, I18n, History} from 'h-react-antd';

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.search = this.search._ ? this.search._.split('_') : [];

    const c = this.search[1] || 0;
    const e = this.search[2] || 0;
    const per = Math.ceil((document.body.offsetHeight - 44) / 94);

    this.filter = {
      current: this.search[0] || 1,
      per: per,
      category_id: c,
    };
    this.state = {
      category: LocalStorage.get('homepage-category') || [],
      essay: [],
      currentCategoryId: c,
      currentEssayId: e,
      currentEssay: null,
      loading: false,
    }
  }

  componentDidMount() {
    this.queryCategory();
  }

  setter = () => {
    const categoryKV = {};
    this.state.category.forEach((obj) => {
      categoryKV[obj.essay_category_id] = obj;
    });
    const essayKV = {};
    this.state.essay.list.forEach((obj) => {
      essayKV[obj.essay_id] = obj;
    });

    this.state.currentEssay = essayKV[this.state.currentEssayId] || null;
    this.setState({currentEssay: this.state.currentEssay});
    //
    let tit = '魂之·文库';
    if (this.state.currentCategoryId > 0) {
      tit += '>' + categoryKV[this.state.currentCategoryId].essay_category_name;
    }
    if (this.state.currentEssayId > 0) {
      tit += '>' + essayKV[this.state.currentEssayId].essay_title;
    }
    document.title = tit;
    history.replaceState(null, tit, Parse.urlEncode({
      _: [
        this.filter.current,
        this.state.currentCategoryId,
        this.state.currentEssayId,
      ].join("_")
    }));
    // views
    Api.query().post({NORMAL_ESSAY_VIEWS: {id: this.state.currentEssayId}}, () => null);
  }

  queryCategory = () => {
    if (this.state.category.length <= 0) {
      Api.query().post({NORMAL_ESSAY_CATEGORY_LIST: {}}, (response) => {
        Api.handle(response,
          () => {
            this.state.category = response.data;
            this.setState({
              category: this.state.category,
            });
            LocalStorage.set('homepage-category', this.state.category, 3600 * 1e3);
            if (this.state.currentCategoryId <= 0) {
              this.state.currentCategoryId = this.state.category[0].essay_category_id;
              this.setState({currentCategoryId: this.state.currentCategoryId});
            }
            this.queryEssay();
          }
        );
      });
    } else {
      if (this.state.currentCategoryId <= 0) {
        this.state.currentCategoryId = this.state.category[0].essay_category_id;
        this.setState({currentCategoryId: this.state.currentCategoryId});
      }
      this.queryEssay();
    }
  }

  queryEssay = () => {
    if (this.state.currentCategoryId > 0) {
      this.filter.category_id = this.state.currentCategoryId;
      const cacheKey = `homepage-essay-${this.state.currentCategoryId}`;
      this.setState({loading: true});
      Api.query().post({NORMAL_ESSAY_PAGE: this.filter}, (response) => {
        this.setState({loading: false});
        Api.handle(response,
          () => {
            this.state.essay = response.data;
            this.setState({
              essay: this.state.essay,
            });
            if (this.state.currentEssayId <= 0) {
              this.state.currentEssayId = this.state.essay.list[0].essay_id;
              this.setState({currentEssayId: this.state.currentEssayId});
            }
            this.setter();
          }
        );
      });
    }
  }

  renderSelectedKeysCate = () => {
    return [this.state.currentCategoryId.toString(10)];
  }

  fire = (x, y) => {
    const getColor = () => {
      let str = '#';
      for (let i = 0; i < 6; i++) {
        str += (Math.round(Math.random() * 16)).toString(16);
      }
      return str;
    }
    const getStyle = (ele, attr) => {
      if (ele.currentStyle) {
        return ele.currentStyle[attr];
      } else {
        return getComputedStyle(ele, false)[attr];
      }
    }
    const move = function (fireObj, json) {
      let limit = 12;
      const times = setInterval(() => {
        limit--;
        for (let attr in json) {
          const nowSize = parseInt(getStyle(fireObj, attr));
          let speed = (json[attr] - nowSize) / 7;
          fireObj.style[attr] = speed + nowSize + 'px';
          if (limit <= 0 || json[attr] == nowSize) {
            clearInterval(times);
            fireObj.remove();
          }

        }
      }, 30);
    }
    for (let i = 0; i < 20; i++) {
      //烟花粒子
      const oDivS = document.createElement('div');
      const oSize = Parse.randInt(6, 14) + 'px';
      oDivS.style.width = oSize;
      oDivS.style.height = oSize;
      oDivS.style.position = 'fixed';
      oDivS.style.borderRadius = '50%';
      oDivS.style.backgroundColor = getColor();
      document.body.append(oDivS);
      oDivS.style.top = y + 'px';
      oDivS.style.left = x + 'px';
      const left = Parse.randInt(0, document.body.offsetWidth - oDivS.offsetWidth);
      const top = Parse.randInt(0, document.body.offsetHeight - oDivS.offsetHeight);
      move(oDivS, {left: left, top: top});
    }
  }

  render() {
    return (
      <div className="page-homepage">
        <Menu
          className="cate"
          theme="dark"
          mode="inline"
          selectedKeys={this.renderSelectedKeysCate()}
          onClick={(e) => {
            this.setState({
              currentCategoryId: e.key,
            });
          }}
        >
          {
            this.state.category.map((obj) => {
              return (
                <Menu.Item key={obj.essay_category_id} className="cateItem">
                  <XossShow src={obj.essay_category_logo}/>
                  <span>{obj.essay_category_name}</span>
                </Menu.Item>
              );
            })
          }
        </Menu>
        <div className="essay">
          <List
            loading={this.state.loading}
            itemLayout="vertical"
            dataSource={this.state.essay.list}
            renderItem={item => (
              <List.Item
                className={parseInt(this.state.currentEssayId) === item.essay_id ? 'active' : null}
                actions={[
                  <Space><EyeOutlined/>{item.essay_views}</Space>,
                  <Space><LikeOutlined/>{item.essay_likes}</Space>,
                  <Space><MessageOutlined/> - </Space>,
                ]}
                onClick={() => {
                  this.state.currentEssayId = item.essay_id;
                  this.setState({currentEssayId: this.state.currentEssayId});
                  this.setter();
                }}
              >
                <List.Item.Meta
                  title={<div>
                    {item.essay_is_excellent === 1 && <span className="excellent">&lt;{I18n('excellent')}&gt;</span>}
                    <span>{item.essay_title}</span>
                  </div>}
                  description={Parse.limitStr(Parse.cleanHTML(item.essay_content), 30)}
                />
              </List.Item>
            )}
          />
          <div className="space-pagination">
            {
              this.state.essay.page &&
              <Pagination
                className="pagination"
                simple={true}
                disabled={this.state.loading}
                defaultCurrent={this.state.essay.page.current}
                defaultPageSize={this.state.essay.page.per}
                total={this.state.essay.page.total}
                onChange={(current) => {
                  this.filter.current = current;
                  this.queryEssay();
                }}
              />
            }
          </div>
        </div>
        <div className="content">
          <div
            className="html"
            dangerouslySetInnerHTML={{
              __html: this.state.currentEssay ?
                this.state.currentEssay.essay_content : ''
            }}
          />
        </div>
        {
          this.state.currentEssay &&
          <div className="operation">
            <Tooltip placement="left" title={I18n('refresh')}>
              <Button
                type="dashed"
                disabled={this.state.loading}
                loading={this.state.loading}
                icon={<RedoOutlined/>}
                onClick={() => {
                  this.queryEssay()
                }}
              />
            </Tooltip>
            <Button
              disabled={this.state.loading}
              icon={<LikeOutlined/>}
              onClick={(e) => {
                this.fire(e.pageX, e.pageY);
                this.setState({loading: true});
                Api.query().post({NORMAL_ESSAY_LIKES: {id: this.state.currentEssayId}}, (response) => {
                  this.setState({loading: false});
                  Api.handle(response, () => {
                    this.queryEssay();
                  });
                });
              }}
            />
            {
              History.state.loggingId > 0 &&
              <Tooltip placement="left" title={I18n('me')}>
                <Button
                  className="avatar"
                  type="default"
                  disabled={this.state.loading}
                  onClick={() => {
                    message.warning('功能未开放');
                  }}
                >
                  <img src="https://www.hunzsig.com/assets/bd388583e4e7cec6dc95ad3fb7994167.jpg"/>
                </Button>
              </Tooltip>
            }
            {
              History.state.loggingId > 0 &&
              <Tooltip placement="left" title={I18n('publish article')}>
                <Button
                  type="primary"
                  disabled={this.state.loading}
                  icon={<PlusOutlined/>}
                  onClick={() => {
                    message.warning('功能未开放');
                  }}
                />
              </Tooltip>
            }
            {
              !History.state.loggingId &&
              <Tooltip placement="left" title={I18n('join')}>
                <Button
                  type="primary"
                  disabled={this.state.loading}
                  icon={<UserOutlined/>}
                  onClick={() => {
                    message.warning('功能未开放');
                  }}
                />
              </Tooltip>
            }
          </div>
        }
      </div>
    );
  }
}

export default Homepage;
