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
interface TrainingsUserState {
  training: any;
  trainings: any[];
  trainingsList: any[];
}
interface ApolloProps {
  client: any;
}
class TrainingsUser extends React.Component<ApolloProps, TrainingsUserState> {
  
  state: TrainingsUserState = {
    training: null,
    trainings: [],
    trainingsList: []
  };
  seeTraining = (index: number) => {
    this.setState({training: this.state.trainings[index]});
  }
  async componentDidMount() {

    try {
    const { data } = await this.props.client.query({
      query,
      variables: {
        email: localStorage.getItem('email'),
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
                <Col span={8}>
                    <Card title="Trainings">     
                  {this.state.trainings ?
                               
                    <List
                      size="small"
                      bordered={true}
                      dataSource={this.state.trainingsList}
                      renderItem={(item: any, index: any) => (
                        <List.Item 
                          actions={[ <a  key={index} onClick={() => this.seeTraining(index)}> 
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
                  : <Card title="Loading Training"> 
                    Loading <Icon type="loading" spin={true} />
                  </Card> }
                  </Col>
                 
                  </Row>
              </div>  
    );
  }
}

export default withApollo<{}, {}>(TrainingsUser as any);
