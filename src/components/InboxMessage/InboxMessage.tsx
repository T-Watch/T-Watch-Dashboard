import * as React from 'react';
import { List, Avatar, Tooltip } from 'antd';

export interface InboxMessageProps {
  from: string;
  subject: string;
  date: Date;
  onClick?: Function;
}

class InboxMessage extends React.Component<InboxMessageProps, {}> {
  render() {
    return (
      <List.Item style={{ cursor: 'pointer', width: '100%' }}>
        <List.Item.Meta
          avatar={<Tooltip title={this.props.from} placement="left" ><Avatar icon="user" /></Tooltip>}
          title={this.props.subject}
          description={this.props.date.toString()}
        />
      </List.Item>
    );
  }
}

export default InboxMessage;
