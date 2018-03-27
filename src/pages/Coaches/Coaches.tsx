import * as React from 'react';
import { Row, Col } from 'antd';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card, AllCoaches } from '../../components';
import { Coach } from '../../components';
import MyCoaches from '../../components/MyCoaches/MyCoaches';

const query = gql`
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
}`;
interface CoachesProps {
  email: string;
}
interface CoachesState {
  coach: CoachObject | null;
}
interface ApolloProps {
  client: any;
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

class Coaches extends React.Component <CoachesProps & ApolloProps,
CoachesState> {
  state: CoachesState = {
    coach: null
  };
  async componentDidMount() {
    if (!this.props.email) {
      return;
    }
    try {
    const res = await this.props.client.query({
      query,
      variables: {
        email: this.props.email
      }
    });
    this.setState({coach: res.data.user});
  } catch (e) {
    // console.error(e);
  }
  }
  
getAge = (birthdayDate: Date) => { // birthday is a date
  var birthday = new Date(birthdayDate);
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

  render() {
    if (!this.props.email || !this.state.coach) {
      return( 
      <div>
      <Row gutter={40}>
          <Col className="gutter-row" span={8}>
            <Card title="All coaches" icon="team" >
              <AllCoaches/>
            </Card>
          </Col>
          <Col className="gutter-row" span={8}>
            <Card title="Coach" icon="user" > 
            <p style={{textAlign: 'center'}}>Any coach selected</p>
            </Card>
          </Col>
          <Col className="gutter-row" span={8}>
            <Card title="My coaches" icon="star" >
              <p style={{textAlign: 'center'}}>Any coach yet</p>
              <p style={{textAlign: 'center'}}>What do you waiting for?</p>
            </Card>
          </Col>
        </Row>
    </div>
    );
    }
    const data = {user: this.state.coach};
    const names = (data as any).user.name;
    const lastName = (data as any).user.lastName;
    const district = (data as any).user.district;
    const province = (data as any).user.province;
    const phoneNumber = (data as any).user.phoneNumber;
    const gender = (data as any).user.gender;
    const age = this.getAge((data as any).user.birthday);
    const fields = (data as any).user.fields;
    const email = (data as any).user.email;
    return (
      <div>
    <Row gutter={40}>
        <Col className="gutter-row" span={8}>
          <Card title="All coaches" icon="team" >
            <AllCoaches/>
          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card title="Coach" icon="user" > 
          {this.props.email ?
            <Coach 
              email={email} 
              name={names} 
              lastName={lastName} 
              district={district} 
              province={province}
              phoneNumber={phoneNumber} 
              gender={gender} 
              age={age} 
              fields={fields}
            />
            : 
            <p style={{textAlign: 'center'}}>Any coach selectedWhat do you waiting for?</p>
            }
          {/*  <Coach email='mariaentrenadora@gmail.com' />*/}

          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card title="My coaches" icon="star" >
            <p style={{textAlign: 'center'}}>Any coach yet</p>
            <p style={{textAlign: 'center'}}>What do you waiting for?</p>
            <MyCoaches/>
          </Card>
        </Col>
      </Row>
      </div>
      );
    }
  }  

export default withApollo<CoachesProps, {}>(Coaches as any);
