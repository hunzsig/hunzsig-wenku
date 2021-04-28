import './Homepage.less';
import React, {Component} from 'react';
import {Api} from 'h-react-antd';
import {Col, Row} from "antd";
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
      AUTHOR_STAT_ESSAY: {},
      AUTHOR_STAT_ESSAYCATEGORY: {},
      AUTHOR_STAT_ESSAYGROW: {},
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
          <Col span={12}>
            <Essay data={this.state.data.AUTHOR_STAT_ESSAY || []}/>
          </Col>
          <Col span={12}>
            <EssayCategory data={this.state.data.AUTHOR_STAT_ESSAYCATEGORY || []}/>
          </Col>
          <Col span={24}>
            <EssayGrow data={this.state.data.AUTHOR_STAT_ESSAYGROW || []}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Homepage;
