import React from 'react';
import { Card, Modal, Icon } from 'antd';
import './CoachCard.css';

interface CoachCardProps {
    name: string;
    lastName: string;
    description: string;
    photo: string;
    location: string;
    type: string;  
    email: string;  
    fields: string[];    
}

interface CoachCardState {
    name: string;
    lastName: string;
    description: string;
    photo: string;
    isActive: boolean;
    location: string;
    type: string;
    email: string;
    fields: string[];
}
export default class CoachCard extends React.Component <CoachCardProps, CoachCardState > {
    constructor(props: CoachCardProps) {
        super(props);
        this.state = {
            email: this.props.email,
            name: this.props.name,
            lastName: this.props.lastName,
            description: this.props.description,
            photo: this.props.photo,
            location: this.props.location,
            type: this.props.type,
            fields: this.props.fields,
            isActive: false
        };
    }
    toggleModal = () => {
        window.location.href =
                'http://localhost:3000/coaches/' + this.props.email;
                
    }
    render() {
        return (
            <div className="card">
                <Card 
                    title={this.state.name + ' ' + this.state.lastName}
                    extra={<span  
                            style={{
                            cursor: 'pointer',
                            color: 'black'
                            }} 
                            onClick={this.toggleModal}
                    > <Icon type="user-add" style={{fontSize: 26}}/> 
                    </span>}
                >
                
                    <p><Icon type="mail" />   {this.state.description}</p>
                    <p><Icon type="pushpin-o" />   {this.state.fields.toString()}</p>
                </Card>
                
            </div>
        );
    }

}