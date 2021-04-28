import './Homepage.less';
import React, {Component} from 'react';
import {Api} from 'h-react-antd';
import {Col, Row} from "antd";
import User from "./Chart/User";
import UserGrow from "./Chart/UserGrow";
import UserAccount from "./Chart/UserAccount";
import Essay from "./Chart/Essay";
import EssayCategory from "./Chart/EssayCategory";
import EssayGrow from "./Chart/EssayGrow";

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    }
  }

  componentDidMount() {
    this.query();
  }

  query = () => {
    this.setState({user: [], account: []});
    Api.query().post({
      STAT_USER: {},
      STAT_USERACCOUNT: {},
      STAT_USERGROW: {},
      STAT_ESSAY: {},
      STAT_ESSAYCATEGORY: {},
      STAT_ESSAYGROW: {},
    }, (response) => {
      Api.handle(response,
        () => {
          this.setState({data: response.data});
        }
      );
    });
  }

  render() {
    return (
      <div className="page-homepage">
        <Row type="flex" justify="center" align="middle" gutter={20}>
          <Col span={7}>
            <User data={this.state.data.STAT_USER || []}/>
          </Col>
          <Col span={7}>
            <UserAccount data={this.state.data.STAT_USERACCOUNT || []}/>
          </Col>
          <Col span={10}>
            <UserGrow data={this.state.data.STAT_USERGROW || []}/>
          </Col>
          <Col span={7}>
            <Essay data={this.state.data.STAT_ESSAY || []}/>
          </Col>
          <Col span={7}>
            <EssayCategory data={this.state.data.STAT_ESSAYCATEGORY || []}/>
          </Col>
          <Col span={10}>
            <EssayGrow data={this.state.data.STAT_ESSAYGROW || []}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Homepage;
