import React from 'react';
import { Card, Icon } from 'antd';

interface CoachCardProps {
    name: string;
    lastName: string;
    // photo: string;
    province: string;
    district: string;
    phoneNumber: string;
    email: string;
    dueDate: Date;  
}

export default class UserCard extends React.Component <CoachCardProps, any > {
    constructor(props: CoachCardProps) {
        super(props);

    }
    render() {
        const  dueDateFormat = new Date(this.props.dueDate);

        return (

            <div className="card">
                <Card 
                    title={this.props.name + ' ' + this.props.lastName}         
                >
                    <p><Icon type="mail" />   {this.props.email}</p>
                    <p><Icon type="mobile" />   {this.props.phoneNumber}</p>
                    <p><Icon type="compass" />   {this.props.district} - ({this.props.province})</p>
                  
                    <p><Icon type="mobile" />   
                    Suscrito hasta el&nbsp;
                     {dueDateFormat.getDate()}-{dueDateFormat.getMonth() + 1}-{dueDateFormat.getFullYear()}</p>
                    
                </Card>
                
            </div>
        );
    }

}