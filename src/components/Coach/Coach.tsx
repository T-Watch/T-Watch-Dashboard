import * as React from 'react';
import { Button, Avatar, Icon, Card, Modal } from 'antd';
import { HireCoach } from '../../components';
interface CoachProps {
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

interface CoachState {
     isActiveModal: boolean;
  }
class Coach extends React.Component<CoachProps,
CoachState> {

constructor(props: CoachProps) {
    super(props);
    this.state = {
        isActiveModal: false
      };
}

handleHire = () => {
    //
  }

toggleModal = () => {
    this.setState({
        isActiveModal: !this.state.isActiveModal
    });
}
render() {
    return(
        <div>
        <Card 
          title={
            <div>
              <Avatar icon="user" />
              &nbsp;  &nbsp; {this.props.name}  &nbsp; 
              {this.props.lastName}
            </div>
          }
        >       
            <p>  <Icon type="home" />  &nbsp;{this.props.district} ({this.props.province}) </p>
            <p>  <Icon type="mail" />  &nbsp;{this.props.email} </p>
            <p>  <Icon type="phone" />  &nbsp;{this.props.phoneNumber} </p>
            {this.props.gender === 'F' ?
            <div>
              <p>  <Icon type="woman" /> {this.props.age} años </p> 
            </div>
            : 
            <div>
             <p> <Icon type="man" /> {this.props.age} &nbsp; años </p>
            </div>}
            
            <br/>
            <div style={{textAlign: 'center'}}>
            <Button style={{textAlign: 'center'}} onClick={this.toggleModal}>Contratar</Button>
            </div>
            <Modal 
             title="Contratar entrenador" 
             zIndex={2} 
             visible={this.state.isActiveModal} 
             onCancel={this.toggleModal} 
             footer={null}
            >
            <Icon
                type="arrow-left"
                style={{
                fontSize: 20
            }}
                onClick={this.toggleModal}
            />
                <HireCoach email={this.props.email}/>
            </Modal>
        </Card>
        </div>
    );   
}
}
export default Coach;