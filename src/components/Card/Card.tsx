import * as React from 'react';
import { Card, Icon } from 'antd';

export interface CardProps {
  title: string;
  icon?: string;
  style?: any;
}

class CustomCard extends React.Component<CardProps, {}> {
  render() {
    return (
      <Card style={this.props.style}>
        <div style={{ fontWeight: 'bold', fontSize: 23 }}>
          {this.props.icon ? <Icon type={this.props.icon} style={{ marginRight: 5 }} /> : null}
          <span>{this.props.title}</span>
        </div>
        <div style={{ padding: 15 }}>
          {this.props.children}
        </div>
      </Card>
    );
  }
}

export default CustomCard;
