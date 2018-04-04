import * as React from 'react';
import './ShowCardsUsers.css';
import { UserCard } from '../../components';

interface ShowCardsProps {
  users: object[];
}

class ShowCardsUsers extends React.Component  <ShowCardsProps, any > {
  constructor(props: ShowCardsProps) {
    super(props);
}

  render() {
    return (
     <div>
     {this.props.users.map(function(user: any, i: any) {
       return(  
       <ul key={user.email}>
        <UserCard 
         name={user.name} 
         lastName={user.lastName}
         email={user.email}
         phoneNumber={user.phoneNumber} 
         province={user.province}
         district={user.district}
         dueDate={user.plan.dueDate}
        />
       </ul>);
     })}
   </div>
    );
  }
  }
export default ShowCardsUsers;