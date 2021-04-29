import './Homepage.less';
import React, {Component} from 'react';
import {message, Row, Col, Menu, List, Tooltip, Button, Input} from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  RedoOutlined,
  TranslationOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {Api, LocalStorage, Parse, I18n, Moment, I18nContainer} from 'h-react-antd';
import Xoss from "h-react-antd/Xoss";

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.search = this.search._ ? this.search._.split('_') : [];

    const c = this.search[1] || 0;
    const e = this.search[2] || 0;

    this.filter = {
      category_id: c,
    };
    this.state = {
      category: LocalStorage.get('homepage-category') || [],
      essay: [],
      currentCategoryId: c,
      currentEssayId: e,
      currentEssay: null,
      loading: false,
      searchKey: '',
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
    this.state.essay.forEach((obj) => {
      essayKV[obj.essay_id] = obj;
    });

    this.state.currentEssay = essayKV[this.state.currentEssayId] || null;
    this.setState({currentEssay: this.state.currentEssay});
    //
    let tit = '魂之·文库';
    if (this.state.currentCategoryId > 0 && categoryKV[this.state.currentCategoryId]) {
      tit += '>' + categoryKV[this.state.currentCategoryId].essay_category_name;
    }
    if (this.state.currentEssayId > 0 && essayKV[this.state.currentEssayId]) {
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
            LocalStorage.set('homepage-category', this.state.category, 600);
            if (this.state.currentCategoryId <= 0 && this.state.category[0]) {
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
      this.setState({loading: true});
      Api.query().post({NORMAL_ESSAY_LIST: this.filter}, (response) => {
        this.setState({loading: false});
        Api.handle(response,
          () => {
            this.state.essay = response.data;
            this.setState({
              essay: this.state.essay,
            });
            if (this.state.currentEssayId <= 0 && this.state.essay.length > 0) {
              this.state.currentEssayId = this.state.essay[0].essay_id;
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
          let speed = (json[attr] - nowSize) / 5;
          fireObj.style[attr] = speed + nowSize + 'px';
          if (limit <= 0 || json[attr] == nowSize) {
            clearInterval(times);
            fireObj.remove();
          }

        }
      }, 30);
    }
    for (let i = 0; i < 30; i++) {
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
      const left = Parse.randInt(oDivS.offsetLeft - 300, oDivS.offsetLeft + 50);
      const top = Parse.randInt(oDivS.offsetTop - 200, oDivS.offsetTop + 200);
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
            this.state.currentEssayId = 0;
            this.state.currentCategoryId = e.key;
            this.setState({currentCategoryId: this.state.currentCategoryId});
            this.queryEssay();
          }}
        >
          {
            this.state.category.map((obj) => {
              return (
                <Menu.Item key={obj.essay_category_id} className="cateItem">
                  <img alt={obj.essay_category_name} src={Xoss.url(obj.essay_category_logo)}/>
                  <span>{obj.essay_category_name}</span>
                </Menu.Item>
              );
            })
          }
        </Menu>
        <div className="essay">
          <div className="searcher">
            <Input
              placeholder={I18n(['PLEASE_INPUT', 'KEYWORD'])}
              prefix={<SearchOutlined/>}
              onChange={(evt) => {
                this.setState({
                  searchKey: evt.target.value || '',
                });
              }}
            />
          </div>
          <List
            loading={this.state.loading}
            itemLayout="vertical"
            dataSource={this.state.essay}
            renderItem={(item) => {
              if (this.state.searchKey.length > 0) {
                const sk = this.state.searchKey.toLowerCase();
                const lt = item.essay_title.toLowerCase();
                const lc = item.essay_content.toLowerCase();
                const le = I18n('excellent').toLowerCase();
                const p1 = lt.toLowerCase().indexOf(sk) === -1;
                const p2 = lc.toLowerCase().indexOf(sk) === -1;
                const p3 = sk.indexOf(le) === -1 || (sk.indexOf(le) !== -1 && parseInt(item.essay_is_excellent, 10) !== 1);
                if (p1 && p2 && p3) {
                  return null;
                }
              }
              return (
                <List.Item
                  className={parseInt(this.state.currentEssayId) === item.essay_id ? 'active' : null}
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
              );
            }}
          />
        </div>
        <div className="content">
          {
            this.state.currentEssay &&
            <Row className="attr">
              <Col span={6}>
                {I18n('author')}: {this.state.currentEssay.essay_author}
              </Col>
              <Col span={12}>
                {I18n(['publish', 'time'])}: {Moment.format(this.state.currentEssay.essay_publish_time)}
              </Col>
              <Col span={3}>
                <EyeOutlined/>&nbsp;{this.state.currentEssay.essay_views}
              </Col>
              <Col span={3}>
                <LikeOutlined/>&nbsp;{this.state.currentEssay.essay_likes}
              </Col>
            </Row>
          }
          <div
            className="html"
            dangerouslySetInnerHTML={{__html: this.state.currentEssay ? this.state.currentEssay.essay_content : ''}}
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
            <I18nContainer placement="right">
              <Tooltip placement="left" title={I18n('Switch language')}>
                <Button
                  type="dashed"
                  disabled={this.state.loading}
                  icon={<TranslationOutlined/>}
                />
              </Tooltip>
            </I18nContainer>
            <Button
              disabled={this.state.loading}
              icon={<LikeOutlined/>}
              onClick={(e) => {
                this.fire(e.pageX, e.pageY);
                this.setState({loading: true});
                Api.query().post({NORMAL_ESSAY_LIKES: {id: this.state.currentEssayId}}, (response) => {
                  Api.handle(response, () => {
                    this.queryEssay();
                  });
                  const self = this;
                  const t = window.setTimeout(function () {
                    window.clearTimeout(t);
                    self.setState({loading: false});
                  }, 2000)
                });
              }}
            />
          </div>
        }
      </div>
    );
  }
}

export default Homepage;
