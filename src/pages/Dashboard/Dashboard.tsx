import * as React from 'react';
import { Row, Col, List, Icon } from 'antd';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card, InboxMessage, TrainingSummary, MessageModal } from '../../components';
import { InboxMessageProps } from '../../components/InboxMessage/InboxMessage';

const query = gql`
  query Q($to: String!){
    messages(to: $to){
      _id
      from
      to
      subject
      date
      body
    }
  }
`;

const lastTraining = {
  person: 'Brais',
  distance: 1000,
  duration: 3600,
  type: 'running',
  completed: true,
  data: [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ]
};

interface State {
  modal: boolean;
  messageToShow: any;
  skip: number;
}

class Dashboard extends React.Component<{}, State> {
  state: State = {
    modal: false,
    messageToShow: undefined,
    skip: 0
  };
  render() {
    const { skip } = this.state;

    return (
      <Row gutter={40}>
        <Col className="gutter-row" span={12}>
          <Card title="Inbox" icon="inbox" >
            <Query
              query={query}
              variables={{ to: localStorage.getItem('email') }}
            >
              {({ loading, error, data }) => {
                if (loading) {
                  return (<span>Loading...</span>);
                }
                if (!error && data) {
                  return (
                    <div>
                      <List
                        size="small"
                        dataSource={
                          data.messages.slice(skip === 0 ? 0 : skip, skip === 0 ? 4 : skip + 4)
                        }
                        renderItem={(item: InboxMessageProps) => (
                          <InboxMessage {...item} onClick={() => this.setState({ modal: true, messageToShow: item })} />
                        )}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 15 }}>
                        <Icon
                          type="left"
                          style={{
                            visibility: this.state.skip === 0 ? 'hidden' : 'visible',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => this.setState({ skip: this.state.skip - 5 })}
                        />
                        <Icon
                          type="plus"
                          style={{ cursor: 'pointer', fontWeight: 'bold' }}
                          onClick={() => this.setState({ modal: true, messageToShow: undefined })}
                        />
                        <Icon
                          type="right"
                          onClick={() => this.setState({ skip: this.state.skip + 5 })}
                          style={{
                            visibility: this.state.skip <= data.messages.length ? 'hidden' : 'visible',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            </Query>
          </Card>
        </Col>
        <Col className="gutter-row" span={12}>
          <Card title="Last training" icon="line-chart" >
            <TrainingSummary {...lastTraining} />
          </Card>
        </Col>
        {/*<Col className="gutter-row" span={8}>
          <Card title="inbox" icon="inbox" >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
            </Col>*/}
        <MessageModal
          onCancel={() => this.setState({ modal: false })}
          visible={this.state.modal}
          message={this.state.messageToShow}
        />
      </Row>
    );
  }
}

export default Dashboard;
