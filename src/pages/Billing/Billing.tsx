import * as React from 'react';
import { Row, Col } from 'antd';
import { PlanCard } from '../../components';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card  } from '../../components';
import { MyUsers } from '../../components';

const query = gql`
query Query($coach: String) {
  plans(coach: $coach){
   _id,
   type,
   monthlyPrice
  }
}`;
interface CoachesProps {
    coach: string;
   
}
interface CoachesState { 
    basicPrice: number;
    standarPrice: number;
    premiumPrice: number;
    
}
interface ApolloProps {
  client: any;
}

class Billing extends React.Component <CoachesProps & ApolloProps,
CoachesState> {
  state: CoachesState = {
      basicPrice: 0,
      standarPrice: 0,
      premiumPrice: 0  
  };
  async componentDidMount() {
    if (!this.props.coach) {
      return;
    }
    try {
    const { data } = await this.props.client.query({
      query,
      variables: {
        email: this.props.coach
      }
    });
    const plans = data.plans;
   // console.log(plans);

    for (var i = 0; i < plans.length; i++) {
        if (plans[i].type === 'BASIC') {
            this.setState({basicPrice: plans[i].monthlyPrice});
        } else if (plans[i].type === 'STANDAR') {
            this.setState({standarPrice: plans[i].monthlyPrice});
        } else if (plans[i].type === 'PREMIUM') {
            this.setState({premiumPrice: plans[i].monthlyPrice});
        }
    }
  } catch (e) {
   // console.error(e);
  }
  }
  
  render() {
    return (
      <div>
    <Row gutter={40}>
        <Col className="gutter-row" span={8}>
          <Card title="My plans" icon="book" >
          <PlanCard coach={this.props.coach} type="BASIC" monthlyPrice={this.state.basicPrice}/>
          <PlanCard coach={this.props.coach} type="STANDAR" monthlyPrice={this.state.standarPrice}/>
          <PlanCard coach={this.props.coach} type="PREMIUM" monthlyPrice={this.state.premiumPrice}/>
          </Card>
        </Col>
        <Col className="gutter-row" span={12}>
          <Card title="My users" icon="star" >
          <MyUsers/>
          </Card>
        </Col>
      </Row>
      </div>
      );
    }
  }  

export default withApollo<CoachesProps, {}>(Billing as any);
