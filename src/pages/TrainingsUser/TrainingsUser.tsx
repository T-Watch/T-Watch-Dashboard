import * as React from 'react';
import { Query, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Table, Row, Col, Icon } from 'antd';
import { Card, TrainingForm } from '../../components';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

class TrainingsUser extends React.Component<any, any> {

  render() {
    return (
      <Query
        query={query}
        variables={{
          email: localStorage.getItem('email'),
          completed: true
        } as any}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (<span>Loading...</span>);
          }
          if (!error && data) {
            const trainings = (data as any).trainings; 
            const lastTraining = trainings[trainings.length - 1];
            const trainingDate = new Date(lastTraining.lastModified);
            const trainingDateString =
           
            console.log(lastTraining);
            
            let HRspeed = [{HR: 0, speed: 0}];
            for (const tb of lastTraining.trainingBlocks) {
            for (const tbr of tb.result) {
            
              let date = {HR: tbr.HR, speed: tbr.speed };
              HRspeed.push(date);
            }
            }
            return (
              <div>
                <Row gutter={12}>
                <Col span={6}>
                    <Card title="Trainings">                
                    <p>pendientes </p>
                    
                    </Card>
                  </Col>
                  <Col span={12}>
                  <Card 
                    title = {'Last Training  ' + trainingDate.getDate() + '-' + 
                    (trainingDate.getMonth() + 1) + '-' + trainingDate.getFullYear()} 
                    > 
                     <Card title="HR - speed">

                    <ScatterChart width={300} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                      <XAxis dataKey={'HR'} type="number" name="HR" unit="bpm"/>
                      <YAxis dataKey={'speed'} type="number" name="speed" unit="km/h"/>
                      <CartesianGrid />
                      <Scatter name="HR - speed" data={HRspeed} fill="#8884d8"/>
                      <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                    </Card>
                    <Card title="HR2 - speed">

                    <ScatterChart width={300} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                      <XAxis dataKey={'HR'} type="number" name="HR" unit="bpm"/>
                      <YAxis dataKey={'speed'} type="number" name="speed" unit="km/h"/>
                      <CartesianGrid />
                      <Scatter name="HR - speed" data={HRspeed} fill="#8884d8"/>
                      <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                    </Card>
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

export default TrainingsUser;
