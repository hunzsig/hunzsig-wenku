import React, {Component} from 'react';
import {PieChart} from 'bizcharts';
import {Spin} from "antd";

class User extends Component {
  constructor(props) {
    super(props);
  }

  count = () => {
    let count = 0;
    this.props.data.forEach((obj) => {
      count += obj.value;
    });
    return count;
  }

  render() {
    return (
      <div className="chart">
        {
          this.props.data.length > 0
            ?
            <PieChart
              autoFit
              forceFit
              data={this.props.data}
              padding='auto'
              xField="year"
              yField="value"
              angleField="value"
              colorField="label"
              title={{
                visible: true,
                text: `用户状态(共${this.count()}人)`,
              }}
              meta={{
                label: {alias: '状态'},
                value: {alias: '数量'},
              }}
              label={{type: 'spider',}}
              legend={{position: 'bottom-center'}}
            />
            :
            <Spin/>
        }
      </div>
    );
  }
}

export default User;
