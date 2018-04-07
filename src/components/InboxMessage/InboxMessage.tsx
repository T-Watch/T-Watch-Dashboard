import * as React from 'react';
import moment from 'moment';
import { List, Avatar, Tooltip } from 'antd';
import * as Utils from '../../Utils';

export interface InboxMessageProps {
  from: string;
  subject: string;
  date: Date;
  onClick: Function;
}

class InboxMessage extends React.Component<InboxMessageProps, {}> {
  render() {
    return (
      <span onClick={() => this.props.onClick()}>
        <List.Item style={{ cursor: 'pointer', width: '100%' }} >
          <List.Item.Meta
            avatar={(
              < Tooltip title={this.props.from} placement="left" >
                <Avatar style={{ background: Utils.randomColor() }}>{this.props.from[0]}</Avatar>
              </Tooltip>
            )}
            title={this.props.subject}
            description={moment(new Date(this.props.date)).calendar()}
          />
        </List.Item>
      </span>
    );
  }
}

export default InboxMessage;
