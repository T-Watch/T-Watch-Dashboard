import React from 'react';
import { Card, Icon, Modal } from 'antd';

interface UserCardProps {
    name: string;
    lastName: string;
    // photo: string;
    province: string;
    district: string;
    phoneNumber: string;
    email: string;
    dueDate: Date;  
    birthday: Date;
    gender: string;
    weight: number;
    height: number;
    diseases: string;
    allergies: string;
    surgeries: string;
}

interface UserCardState {
    isActive: boolean;
}

export default class UserCard extends React.Component <UserCardProps, any > {
    constructor(props: UserCardProps) {
        super(props);
        this.state = {
            isActive: false
        };

    }
    toggleModal = () => {
        this.setState({
            isActive: !this.state.isActive
        });
    }
    render() {
        const  dueDateFormat = new Date(this.props.dueDate);
        const birthdayFormat = new Date(this.props.birthday);
        return (

            <div className="card">
              <Card 
                    title={this.props.name + ' ' + this.props.lastName} 
                    style={{ width: 300 }} 
                    extra={<span  
                            style={{
                            cursor: 'pointer',
                            color: 'black'
                            }} 
                            onClick={this.toggleModal}
                    > More 
                    </span>}
              >
                    <p><Icon type="mail" />   {this.props.email}</p>
                    <p><Icon type="mobile" />   {this.props.phoneNumber}</p>
                    <p><Icon type="compass" />   {this.props.district} - ({this.props.province})</p>
                    <p><Icon type="calendar" />   
                    Subscription until&nbsp;
                     {dueDateFormat.getDate()}-{dueDateFormat.getMonth() + 1}-{dueDateFormat.getFullYear()}</p>
                    
              </Card>

              <Modal 
                    title="User card" 
                    zIndex={2} 
                    visible={this.state.isActive} 
                    onCancel={this.toggleModal} 
                    footer={null}
                    className="modal-login"
              >
                    {this.props.gender === 'F' ?
                    <p><Icon type="woman" />   {this.props.name + ' ' + this.props.lastName}</p>
                   : <p><Icon type="man" />   {this.props.name + ' ' + this.props.lastName}</p>  }
                    <p><Icon type="mail" />   {this.props.email}</p>
                    <p><Icon type="mobile" />   {this.props.phoneNumber}</p>
                    <p><Icon type="compass" />   {this.props.district} - ({this.props.province})</p>
                    <p><Icon type="calendar" />   
                    Subscription until:&nbsp;
                     {dueDateFormat.getDate()}-{dueDateFormat.getMonth() + 1}-{dueDateFormat.getFullYear()}</p>
                    <p><Icon type="calendar" />   
                    Date of birthday:&nbsp;
                     {birthdayFormat.getDate()}-{birthdayFormat.getMonth() + 1}-{birthdayFormat.getFullYear()}</p>
                    <p><Icon type="heart" />  Diseases: {this.props.diseases} </p>
                    <p> <Icon type="heart" /> Surgeries: {this.props.surgeries}</p>
                    <p><Icon type="heart" /> Allergies:  {this.props.allergies} </p>
                    <p><Icon type="line-chart" />   {this.props.weight}kg - {this.props.height}m</p>
                            
              </Modal>
                
            </div>
        );
    }

}