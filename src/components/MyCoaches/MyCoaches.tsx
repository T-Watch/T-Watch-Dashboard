import * as React from 'react';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card, Icon } from 'antd';

interface AllCoachesState {
  coaches: object[];
  planId: string;
  dueDate: string;
  coach: string;
  monthlyPrice: number;
  type: string;
}

interface ApolloProps {
  client: any;
}
const query = gql`
query Query($email: String!) {
  user(email: $email){
    name
    ...on User{
      plan{
        plan
        dueDate
      }
    }
  }
}`;

const querycoach = gql`
query Query($_id: String!) {
  plan(_id: $_id){
  coach
  type
  monthlyPrice
  }
}`; 

class MyUsers extends React.Component< ApolloProps,
AllCoachesState> {
  constructor(props: ApolloProps) {
    super(props);
    this.state = {
        coaches: [],
        planId : '',
        dueDate: '',
        coach: '',
        type: '',
        monthlyPrice: 0
    };
}

async componentDidMount() {
    const user = localStorage.getItem('email');

    try {
        const { data } = await this.props.client.query({
          query,
          variables: {
            email: user
          }
        });
        this.setState({ dueDate: data.user.plan.dueDate});    
        this.setState({ planId:  data.user.plan.plan},
                      () => this.getCoach());

      } catch (e) {
        // console.error(e);
      }
  
}

async getCoach() {

  try {
      const { data } = await this.props.client.query({
        query: querycoach,
        variables: {
          _id: this.state.planId
        }
      });
      this.setState({ coach: data.plan.coach});
      this.setState({ monthlyPrice: data.plan.monthlyPrice});   
      this.setState({ type: data.plan.type});  
    } catch (e) {
      console.error(e);
    }

}

  render() {
    const  dueDateFormat = new Date(this.state.dueDate);
    
    return (

        <div>
          {this.state.planId === '' ?
          <div>
          <p style={{textAlign: 'center'}}>Any  yet</p>
          <p style={{textAlign: 'center'}}>What do you waiting for?</p>
          </div>
          :  
          <Card title={this.state.coach}>
            <p><Icon type="calendar" />   
            Suscrito hasta el&nbsp;
            {dueDateFormat.getDate()}-{dueDateFormat.getMonth() + 1}-{dueDateFormat.getFullYear()}</p>            
            <p><Icon type="info-circle-o" />  type  {this.state.type} </p>
            <p><Icon type="credit-card" />  {this.state.monthlyPrice} €/mes</p>
        </Card>}
        </div>
    );
  }
}

export default withApollo<{}, {}>(MyUsers as any);
