import * as React from 'react';
import { Query, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import { Row, Col, Icon, List, Avatar } from 'antd';
import { Card, TrainingGraphics } from '../../components';

const query = gql`
  query Query ($email: String!, $completed: Boolean) {
    trainings (user: $email, completed: $completed) {
      _id
      type
      user
      date
      maxDate
      description
      lastModified
      trainingBlocks{
        _id
        coach
        title
        distance
        duration
        maxHR
        minHR
        maxSpeed
        minSpeed
        altitude
        result{
          date
          HR
          speed
        }
      }
      completed
    }
  }
`;

const queryusers = gql`
query Query($coach: String) {
  users(coach: $coach){
    name
    lastName
    phoneNumber
    email
    province
    district
    ...on User{
      plan{
        plan
        dueDate
      }
    }
  }
}`;
interface CustomersState {
  training: any;
  trainings: any[];
  trainingsList: any[];
  users: any[];
}
interface ApolloProps {
  client: any;
}
class Customers extends React.Component<ApolloProps, CustomersState> {
  
  state: CustomersState = {
    users: [],
    training: null,
    trainings: [],
    trainingsList: []
  };

  seeTraining = (index: number) => {
    this.setState({training: this.state.trainings[index]});
  }
  
  async seeTrainings (email: string) {

    const { data } = await this.props.client.query({
        query,
        variables: {
            email: email,
            completed: true
            }
        });
    const trainings = data.trainings;
    
    this.setState({trainings: trainings});
    this.setState({training: trainings[trainings.length - 1]});

    let trainingsList = [];
    for (const training of trainings) {
      let tDate = new Date(training.lastModified);
      let itemList = {
        description: training.description, 
        date: tDate.getDate() + '-' + (tDate.getMonth() + 1) + '-' + tDate.getFullYear(),
        type: training.type
      };
      trainingsList.push(itemList);
    }
    this.setState({trainingsList: trainingsList});

}

  async componentDidMount() {

      const coach = localStorage.getItem('email');
      try {
          const { data } = await this.props.client.query({
            query: queryusers,
            variables: {
              coach: coach
            }
          });

          this.setState({
            users: data.users
          });
  
        } catch (e) {
          // console.error(e);
        }

  }

  render() {
    let trainingDate = new Date();
    if (this.state.training) {
       trainingDate = new Date(this.state.training.lastModified); 
    }
    return (
              <div>
                <Row gutter={12}>
                <Col span={6}>
                <Card title="Users">     
                  {this.state.users ?
                               
                    <List
                      size="small"
                      bordered={true}
                      dataSource={this.state.users}
                      renderItem={(item: any, index: any) => (
                        <List.Item 
                           extra={[ <a  key={index} onClick={() => this.seeTrainings(item.email)}> 
                           see trainings 
                          </a>]}
                        >
                          <List.Item.Meta
                             title={item.name + '  ' + item.lastName}
                             description={item.email}
                          />
                        </List.Item>
                      )}
                    />   
                    : null}                 
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="Trainings">     
                  {this.state.trainings ?
                               
                    <List
                      size="small"
                      bordered={true}
                      dataSource={this.state.trainingsList}
                      renderItem={(item: any, index: any) => (
                        <List.Item 
                          extra={[ <a  key={index} onClick={() => this.seeTraining(index)}> 
                          see more 
                         </a>]}
                        >
                          <List.Item.Meta
                            title={item.type + '  ' + item.date}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />   
                    : null}                 
                    </Card> 

                  </Col>
                  <Col span={12}>
                  {this.state.training ?                  
                   <Card 
                    title={'Last Training  ' + trainingDate.getDate() + '-' + 
                    (trainingDate.getMonth() + 1) + '-' + trainingDate.getFullYear()} 
                   > 
                  <TrainingGraphics training={this.state.training}/>
                   </Card>
                  : <Card title="Any training selected"> 
                    Select a training 
                   </Card> }
                  </Col>
                  </Row>
              </div>  
    );
  }
}

export default withApollo<{}, {}>(Customers as any);
