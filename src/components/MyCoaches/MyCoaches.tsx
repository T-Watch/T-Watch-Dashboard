import * as React from 'react';
import { ShowCardsCoach }  from '../../components';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

interface AllCoachesState {
  coaches: object[];
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

/* const query_dos = gql`
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
}`; */

class MyUsers extends React.Component< ApolloProps,
AllCoachesState> {
  constructor(props: ApolloProps) {
    super(props);
    this.state = {
        coaches: []
    };
}

async componentDidMount() {
    const user = localStorage.getItem('email');
    // console.log(user);

    try {
        const { data } = await this.props.client.query({
          query,
          variables: {
            email: user
          }
        });
      // console.log(data.user.plan.plan);

      } catch (e) {
        // console.error(e);
      }
  
  }
  render() {
    return (

        <div>
       {/* <ShowCardsCoach coaches={this.state.coaches}/>*/}
        </div>
    );
  }
}

export default withApollo<{}, {}>(MyUsers as any);
