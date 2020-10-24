import React, {Component} from 'react';
import {ColumnChart} from 'bizcharts';
import {Spin} from "antd";

class UserGrow extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className="chart">
        {
          this.props.data.length > 0
            ?
            <ColumnChart
              autoFit
              data={this.props.data}
              title={{
                visible: true,
                text: "用户数量近6月成长",
              }}
              forceFit
              padding='auto'
              xField='label'
              yField='value'
              yAxis={{
                tickInterval: Math.max(Math.floor(this.props.data.length / 5), 1),
                tickCount: Math.min(this.props.data.length, 10)
              }}
              meta={{
                label: {alias: '近6个月用户数量成长'},
                value: {alias: '人数'},
              }}
            />
            :
            <Spin/>
        }
      </div>
    );
  }
}

export default UserGrow;
