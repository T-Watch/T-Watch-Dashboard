import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import './ShowTargets.css';
import CoachCard from '../CoachCard/CoachCard';
const { Header, Content, Footer } = Layout;
const  SubMenu  = Menu.SubMenu; 

interface ShowCardsState {
  coaches: object[];
}
interface ShowCardsProps {
  coaches: object[];
}

class ShowTargets extends React.Component  <ShowCardsProps, ShowCardsState > {
  constructor(props: ShowCardsProps) {
    super(props);
    this.state = {
        coaches: this.props.coaches,
    };
}
targets = () => {
  this.setState({
    coaches: this.props.coaches
    });  
}
  render() {
    // this.targets(); 

    return (
     <div>
     {this.props.coaches.map(function(coach: any, i: any) {
       return   <ul key={coach.email}>
       {console.log(coach.lastName)}
       <CoachCard 
       name={coach.name} 
       lastName={coach.lastName}
       description={coach.email} 
       email={coach.email} 
       fields={coach.fields.toString()}/>
       </ul>;
     })}
   </div>
    );
  }
  }
export default ShowTargets;