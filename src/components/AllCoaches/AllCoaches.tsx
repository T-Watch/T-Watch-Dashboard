import * as React from 'react';
import { Row, Col, List, Avatar, Icon, Layout } from 'antd';
import {  ShowTargets } from '../../components';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

interface AllCoachesProps {
  email: string;
}
interface AllCoachesState {
  email: string;
  coaches: object[];
}
interface AllCoachesObject {
    name: string;
    lastName: string;
}
interface ApolloProps {
  client: any;
}

class Coach extends React.Component<AllCoachesProps & ApolloProps,
AllCoachesState> {
  constructor(props: AllCoachesProps & ApolloProps) {
    super(props);
    this.state = {
        email: this.props.email,
        coaches: []
    };
    this.initCoaches();
}

initCoaches = async () => {
    try {
    const { data } = await this.props.client.query({
      query: gql`
      query Query{
        coaches{
          email
          name
          lastName
          fields
        }
      }`  });
      console.log(data.coaches);
    this.setState({
      coaches: data.coaches
      });
  } catch (e) {
    console.log(e.message);
  }
  
  }
  render() {
    return (

        <div>
        <ShowTargets 
            coaches={this.state.coaches} 
        />            
        </div>
    );
  }
}

export default withApollo<{}, {}>(Coach as any);
