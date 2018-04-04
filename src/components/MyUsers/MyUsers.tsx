import * as React from 'react';
import   ShowCardsUsers  from '../ShowCardsUsers/ShowCardsUsers';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

interface AllCoachesState {
  users: object[];
}

interface ApolloProps {
  client: any;
}
const query = gql`
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

class MyUsers extends React.Component< ApolloProps,
AllCoachesState> {
  constructor(props: ApolloProps) {
    super(props);
    this.state = {
        users: []
    };
}

async componentDidMount() {
    const coach = localStorage.getItem('email');
    try {
        const { data } = await this.props.client.query({
          query,
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
    return (

        <div>
        <ShowCardsUsers users={this.state.users}/>
        </div>
    );
  }
}

export default withApollo<{}, {}>(MyUsers as any);
