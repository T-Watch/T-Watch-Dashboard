import * as React from 'react';
import { Row, Col, List } from 'antd';

import { Card, AllCoaches } from '../../components';
import { InboxMessageProps } from '../../components/InboxMessage/InboxMessage';
import Coach from '../../components/Coach/Coach';

interface CoachesProps {
  email: string;
}
interface CoachesState {
  email: string;
}

class Coaches extends React.Component <CoachesProps,
CoachesState> {

  constructor(props: CoachesProps) {
    super(props);
    this.state = {
      email: this.props.email
    };
    console.log('coaches ' + this.props.email);

}
  
  render() {
    return (
          <Row gutter={40}>
            <Col className="gutter-row" span={8}>
              <Card title="All coaches" icon="team" >
                <AllCoaches/>
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="Coach" icon="user" > 
                {/*<Coach email={this.state.email} />*/}
                <Coach email='mariaentrenadora@gmail.com' />
    
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="My coaches" icon="star" >
                <p style={{textAlign: 'center'}}>Any coach yet</p>
                <p style={{textAlign: 'center'}}>What do you waiting for?</p>
              </Card>
            </Col>
          </Row>
    );
  }
}

export default Coaches;
