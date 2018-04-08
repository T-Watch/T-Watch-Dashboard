import React from 'react';
import { Card, Icon } from 'antd';
import './CoachCard.css';

interface CoachCardProps {
    name: string;
    lastName: string;
    // photo: string;
    province: string;
    district: string;
    email: string;  
    fields: string[];  
    onSelectCoach: Function;  
}

export default class CoachCard extends React.Component <CoachCardProps, any > {
    constructor(props: CoachCardProps) {
        super(props);
    }
    toggleModal = () => {
        this.props.onSelectCoach(this.props.email);
      /*  window.location.href =
                'http://localhost:3000/coaches?id=' + this.props.email;*/
                
    }
    render() {
        return (
            <div className="card">
                <Card 
                    title={this.props.name + ' ' + this.props.lastName}
                    extra={<span  
                            style={{
                            cursor: 'pointer',
                            color: 'black'
                            }} 
                            onClick={this.toggleModal}
                    > <Icon type="user-add" style={{fontSize: 26}}/> 
                    </span>}
                >
                
                    <p><Icon type="mail" />   {this.props.email}</p>
                    <p><Icon type="compass" />   {this.props.district} - ({this.props.province})</p>                    
                    <p><Icon type="pushpin-o" />   {this.props.fields.toString()}</p>
                </Card>
                
            </div>
        );
    }

}