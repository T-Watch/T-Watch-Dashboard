import React from 'react';
import { Card, Modal, Icon } from 'antd';
import { UpdatePlan } from '../../components';

interface PlanCardProps {
    type: string;
    monthlyPrice: number;  
    coach: string;
}

interface PlanCardState {
    
    isActive: boolean;
}
export default class PlanCard extends React.Component <PlanCardProps, PlanCardState > {
    constructor(props: PlanCardProps) {
        super(props);
        this.state = {
            isActive: false
        };

    }

    toggleModal = () => {
        this.setState({
            isActive: !this.state.isActive
        });
        console.log(this.state.isActive);
        /*if (this.state.isActive === true) {
            window.location.href =
            'http://localhost:3000/billing';
        }*/
    }
    endModal = () => {
        this.setState({
            isActive: !this.state.isActive
        });
       
        window.location.href =
            'http://localhost:3000/billing';

    }
    render() {
        return (
            <div >
                <Card 
                    title={this.props.type}
                    extra={<span  
                            style={{
                            cursor: 'pointer',
                            color: 'black'
                            }} 
                            onClick={this.toggleModal}
                    > <Icon type="edit" style={{fontSize: 26}}/> 
                    </span>}
                >
                
                    <p><Icon type="credit-card" />  {this.props.monthlyPrice} €/mes</p>
                </Card>

                    <Modal zIndex={2} visible={this.state.isActive} onCancel={this.toggleModal} footer={null}>
                    <Icon
                        type="arrow-left"
                        style={{
                        fontSize: 20
                    }}
                        onClick={this.toggleModal}
                    />

                    <UpdatePlan 
                        close={this.endModal}
                        coach={this.props.coach} 
                        type={this.props.type} 
                        monthlyPrince={this.props.monthlyPrice}
                    />
                </Modal>
            </div>
        );
    }

}