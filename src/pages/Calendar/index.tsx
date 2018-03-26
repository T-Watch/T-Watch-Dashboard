import * as React from 'react';
import moment from 'moment';
import { Calendar, Badge, Col, Row, Timeline } from 'antd';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { Card } from '../../components';
import './Calendar.css';

const query = gql`
  query Q($coach: String, $user: String, $since: Date!){
    trainings(coach: $coach, user: $user, since: $since){
      user
      date
      completed
      _id
      trainingBlocks {
        _id
      }
    }
  }
`;

interface Props {
}

interface State {
  selectedDate: Date;
}

class CalendarPage extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      selectedDate: new Date()
    };
  }

  public render() {
    console.log('Calendar rendered');

    const sinceDate = new Date(this.state.selectedDate.toUTCString());
    sinceDate.setDate(1);

    const variables: any = { since: sinceDate.toUTCString() };
    if (localStorage.getItem('type') === 'COACH') {
      variables.coach = localStorage.getItem('email');
    } else {
      variables.user = localStorage.getItem('email');
    }

    return (
      <Query
        query={query}
        variables={variables}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (<span>Loading...</span>);
          }
          if (!error && data) {
            const selectedDateTrainings = data.trainings
              .filter((t: any) => moment(this.state.selectedDate).isSame(new Date(t.date), 'day'))
              .map((t: any) => {
                let color = 'grey';
                if (!t.completed) {
                  if (moment(this.state.selectedDate).isAfter(new Date(t.date), 'day')) {
                    color = 'red';
                  } else {
                    color = 'blue';
                  }
                }
                return (
                  <Timeline.Item key={t._id} color={color}>
                    <Link to={`/trainings?edit=${t._id}`}>
                      <span
                        style={{ cursor: 'pointer', textDecoration: color === 'grey' ? 'line-through' : 'none' }}
                      >
                        {localStorage.getItem('type') === 'COACH' ?
                          <span>{t.user}</span> : <span>{t.trainingBlocks.length} Training Blocks</span>}
                        {t.description && localStorage.getItem('type') === 'COACH' ? <span> - </span> : null}
                        <span>{t.description}</span>
                      </span>
                    </Link>
                  </Timeline.Item>
                );
              });
            return (
              <Row gutter={8}>
                <Col span={selectedDateTrainings.length > 0 ? 18 : 24}>
                  <Calendar
                    dateCellRender={(e: moment.Moment) => this.dateCellRender(e, data.trainings)}
                    onPanelChange={this.onChange as any}
                    value={moment(this.state.selectedDate)}
                    onSelect={this.onChange as any}
                  />
                </Col>
                <Col span={selectedDateTrainings.length > 0 ? 6 : 0}>
                  <Card
                    title={this.state.selectedDate.toLocaleDateString()}
                    style={{ height: 'calc(100vh - 32px)' }}
                    icon="calendar"
                  >
                    <Timeline>
                      {selectedDateTrainings}
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            );
          }
          return null;
        }}
      </Query>
    );
  }

  private dateCellRender = (m: moment.Moment, trainings: any[]): React.ReactNode => {
    const filteredTrainings = trainings.filter((t: any) => m.isSame(new Date(t.date), 'day'));
    return (
      <ul className="events">
        {
          filteredTrainings.map((item: any) => {
            let status: 'success' | 'processing' | 'default' | 'error' | 'warning' = 'default';
            if (!item.completed) {
              if (m.isAfter(new Date(item.date), 'day')) {
                status = 'error';
              } else {
                status = 'processing';
              }
            }
            return (
              <li key={item._id}>
                <Badge
                  style={item.completed ? { textDecoration: 'line-through' } : {}}
                  status={status}
                  text={localStorage.getItem('type') === 'COACH' ?
                  item.user : `${item.trainingBlocks.length} Training Blocks`}
                />
              </li>
            );
          }
          )
        }
      </ul>
    );
  }

  private onChange = (m: moment.Moment) => {
    this.setState({ selectedDate: m.toDate() });
  }
}

export default CalendarPage;