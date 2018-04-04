import * as React from 'react';
import { Avatar, Icon } from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';

import * as Utils from '../../Utils';

export interface TrainingSummaryProps {
  person: string;
  distance: number;
  duration: number;
  type: string;
  completed: boolean;
  data: any[];
}

class TrainingSummary extends React.Component<TrainingSummaryProps, {}> {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Avatar size="large" style={{ background: Utils.randomColor(), marginRight: 8 }} >
          {this.props.person[0]}
        </Avatar>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 25 }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src="public/clock.svg" style={{ width: 23, height: 23, marginRight: 8 }} />
            <span style={{ fontWeight: 'bold' }}>{Utils.timeFormat(this.props.duration)}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src="public/distance.svg" style={{ width: 30, height: 30, marginRight: 8 }} />
            <span style={{ fontWeight: 'bold' }}>{Utils.distanceFormat(this.props.distance)}</span>
          </span>

          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src="public/running.svg" style={{ width: 28, height: 28, marginRight: 8 }} />
            <span style={{ fontWeight: 'bold' }}>{Utils.capitalize(this.props.type)}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              type={this.props.completed ? 'check' : 'close'}
              style={{
                color: this.props.completed ? 'green' : 'red',
                fontWeight: 'bold',
                fontSize: 28,
                marginRight: 5
              }}
            />
            <span style={{ fontWeight: 'bold' }}>
              {`Training ${this.props.completed ? 'completed' : 'not completed'}`}
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 25 }}>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={this.props.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="amt" />
              <Line type="monotone" dataKey="pv" stroke="#4286f4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default TrainingSummary;
