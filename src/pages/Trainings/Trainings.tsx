import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Table, Row, Col, Icon } from 'antd';
import { Card, TrainingForm } from '../../components';

const query = gql`
  query Query ($email: String!) {
    trainings (coach: $email) {
      _id
      type
      user
      date
      maxDate
      description
      trainingBlocks
      completed
    }
  }
`;

class Trainings extends React.Component {
  render() {
    return (
      <Query
        query={query}
        variables={{
          email: localStorage.getItem('email')
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
                    <Card title="Pending Trainings">
                      <Table
                        size="small"
                        dataSource={trainings.filter((t: any) => !t.completed)}
                        rowKey={(t: any) => t._id}
                      >
                        <Table.Column
                          key="status"
                          render={(t: any) => {
                            if (!t.maxDate) {
                              return null;
                            }
                            const maxDate = new Date(t.maxDate);
                            if (maxDate.getTime() < new Date().getTime()) {
                              return <Icon type="warning" style={{ color: '#001529', fontWeight: 'bold' }} />;
                            }
                            return null;
                          }}
                        />
                        <Table.Column
                          title="User"
                          dataIndex="user"
                        />
                        <Table.Column
                          title="Type"
                          dataIndex="type"
                        />
                        <Table.Column
                          title="Date"
                          render={(t: any) => new Date(t.date).toLocaleDateString()}
                        />
                        <Table.Column
                          title="Max Date"
                          render={(t: any) => {
                            if (!t.maxDate) {
                              return null;
                            }
                            const maxDate = new Date(t.maxDate);
                            return <span>{maxDate.toLocaleDateString()}</span>;
                          }}
                        />
                        <Table.Column
                          title="Training Blocks"
                          render={(t: any) => {
                            return t.trainingBlocks ? t.trainingBlocks.length : 0;
                          }}
                        />
                        <Table.Column
                          title="Actions"
                          render={(t: any) => (
                            <span style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                              <Icon
                                type="edit"
                                onClick={(e: any) => { console.log(`Editar ${t._id}`); }}
                                style={{ cursor: 'pointer' }}
                              />
                              <Icon
                                type="delete"
                                onClick={(e: any) => { console.log(`Eliminar ${t._id}`); }}
                                style={{ cursor: 'pointer' }}
                              />
                            </span>
                          )}
                        />
                      </Table>
                    </Card>
                    <Card title="Completed trainings">
                      <Table
                        size="small"
                        dataSource={trainings.filter((t: any) => t.completed)}
                        rowKey={(t: any) => `${t._id}askdf`}
                      >
                        <Table.Column
                          title="User"
                          dataIndex="user"
                        />
                        <Table.Column
                          title="Type"
                          dataIndex="type"
                        />
                        <Table.Column
                          title="Date"
                          render={(t: any) => new Date(t.date).toLocaleDateString()}
                        />
                        <Table.Column
                          title="Max Date"
                          render={(t: any) => {
                            if (!t.maxDate) {
                              return null;
                            }
                            const maxDate = new Date(t.maxDate);
                            return <span>{maxDate.toLocaleDateString()}</span>;
                          }}
                        />
                        <Table.Column
                          title="Training Blocks"
                          render={(t: any) => {
                            return t.trainingBlocks ? t.trainingBlocks.length : 0;
                          }}
                        />
                      </Table>
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
