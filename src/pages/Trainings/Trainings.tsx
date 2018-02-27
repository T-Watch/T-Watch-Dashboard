import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { List, Row, Col } from 'antd';
import { Card, TrainingForm } from '../../components';

const query = gql`
  query Query ($email: String!, $coach: Boolean!) {
    trainings (coach: $email) @include(if: $coach) {
      registryDate
      coach
    }
  }
`;

class Trainings extends React.Component {
  render() {
    return (
      <Query
        query={query}
        variables={{
          email: localStorage.getItem('email'),
          coach: localStorage.getItem('type') === 'COACH'
        } as any}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (<span>Loading...</span>);
          }
          if (!error && data) {
            const trainings = (data as any).trainings;
            return (
              <div>
                <Row gutter={8}>
                  <Col span={18}>
                    <Card title="Completed trainings">
                      <List
                        size="default"
                        dataSource={trainings}
                        renderItem={(item: any) => (
                          <span>{item.coach}</span>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="Add new training">
                      <TrainingForm />
                    </Card>
                  </Col>
                </Row>
              </div>
            );
          }
          return <span>{error}</span>;
        }}
      </Query>
    );
  }
}

export default Trainings;
