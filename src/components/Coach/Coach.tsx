import * as React from 'react';
import { Button, Avatar, Icon, Card } from 'antd';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

interface CoachProps {
  email: string;
}
interface CoachState {
  email: string;
  coach: CoachObject;
}
interface CoachObject {
    name: string;
    lastName: string;
    district: string;
    province: string;
    phoneNumber: string;
    email: string;
    gender: string;
    age: number;
    fields: string[];
}
interface ApolloProps {
  client: any;
}

class Coach extends React.Component<CoachProps & ApolloProps,
CoachState> {

  constructor(props: CoachProps & ApolloProps) {
    super(props);
    this.state = {
        email: this.props.email,
        coach: {
          name: '', 
          lastName: '', phoneNumber: '', email: '', province: '', district: '', gender: '', age: +18, fields: []}
    };
    this.setCoach();
}

setCoach = async() => {
    const email = this.state.email;
    try {
      const { data } = await this.props.client.query({
        query: gql`
        query Query($email: String!) {
          user(email: $email){
            name
            lastName
            phoneNumber
            email
            district
            province
            birthday
            gender
            ...on Coach{
              fields
            }
          }
        }`,
        variables: {email}
      });  
      let coach = Object.assign({}, this.state.coach);    
      coach.name = data.user.name;  
      coach.lastName = data.user.lastName; 
      coach.district = data.user.district; 
      coach.province = data.user.province; 
      coach.phoneNumber = data.user.phoneNumber; 
      coach.email = data.user.email;  
      coach.fields = data.user.fields;
      coach.age = this.getAge(data.user.birthday);
      coach.gender = data.user.gender;
      this.setState({coach});
    } catch (e) {
      console.log(e.message);
    }
}

getAge = (birthdayDate: Date) => { // birthday is a date
  var birthday = new Date(birthdayDate);
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

handleHire = () => { // birthday is a date
  
}
  render() {
    return (
      <Card 
        title={
          <div>
            <Avatar icon="user" />
            &nbsp;  &nbsp; {this.state.coach.name}  &nbsp; 
            {this.state.coach.lastName}
          </div>
        }

      >
                                        
          <p>  <Icon type="home" />  &nbsp;{this.state.coach.district} ({this.state.coach.province}) </p>
          <p>  <Icon type="mail" />  &nbsp;{this.state.coach.email} </p>
          <p>  <Icon type="phone" />  &nbsp;{this.state.coach.phoneNumber} </p>
          <p>  <Icon type="pushpin-o" />  &nbsp;{this.state.coach.fields.toString()} </p>
          {this.state.coach.gender === 'F' ?
          <div>
            <p>  <Icon type="woman" /> {this.state.coach.age} años </p> 
          </div>
          : 
          <div>
           <p> <Icon type="man" /> {this.state.coach.age} &nbsp; años </p>
          </div>}
             
          <br/>

          <div style={{textAlign: 'center'}}>
          <Button style={{textAlign: 'center'}} onClick={this.handleHire}>Contratar</Button>
          </div>
      </Card>
    );
  }
}

export default withApollo<{}, {}>(Coach as any);
