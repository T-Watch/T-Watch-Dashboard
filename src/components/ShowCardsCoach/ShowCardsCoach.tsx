import * as React from 'react';
import './ShowCardsCoach.css';
import  { CoachCard } from '../../components';

interface ShowCardsCoachState {
  coaches: object[];
}
interface ShowCardsCoachProps {
  coaches: object[];
  onSelectCoach: Function;
}

class ShowCardsCoach extends React.Component  <ShowCardsCoachProps, ShowCardsCoachState > {
  constructor(props: ShowCardsCoachProps) {
    super(props);
    this.state = {
        coaches: this.props.coaches,
    };
}

handleCoach = (coach: any) => {
  this.props.onSelectCoach(coach);
  }
 
/*targets = () => {
  this.setState({
    coaches: this.props.coaches
    });  
}*/
render() {
    return (
     <div>
     {this.props.coaches.map((coach: any, i: any) => {
       return   <ul key={coach.email}>
       <CoachCard 
        name={coach.name} 
        lastName={coach.lastName}
        province={coach.province} 
        district={coach.district} 
        email={coach.email} 
        fields={coach.fields.toString()}
        onSelectCoach={this.handleCoach}
       />
       </ul>;
     })}
   </div>
    );
  }
  }
export default ShowCardsCoach;