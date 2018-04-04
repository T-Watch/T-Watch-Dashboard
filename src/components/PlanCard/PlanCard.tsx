import React from 'react';
import { Card, Modal, Icon } from 'antd';
import { UpdatePlan } from '../../components';

interface PlanCardProps {
    type: string;
    monthlyPrice: number;  
    coach: string;
}

interface PlanCardState {
    monthlyPrice: number;
    isActive: boolean;
}
export default class PlanCard extends React.Component <PlanCardProps, PlanCardState > {
    constructor(props: PlanCardProps) {
        super(props);
        this.state = {
            isActive: false,
            monthlyPrice: this.props.monthlyPrice
        };
    }

async componentDidMount() {
    this.setState({
        monthlyPrice: this.props.monthlyPrice
    });
  
}
    toggleModal = () => {
        this.setState({
            isActive: !this.state.isActive
        });
    }
    endModal = (newMonthlyPrice: number) => {
        this.setState({
            isActive: !this.state.isActive
        });
        this.setState({
            monthlyPrice: newMonthlyPrice
        });
    }
    componentWillReceiveProps(nextProps: any) {
        this.setState({
            monthlyPrice: nextProps.monthlyPrice
        });
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
                
                    <p><Icon type="credit-card" />  {this.state.monthlyPrice} €/mes</p>
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
                        monthlyPrice={this.state.monthlyPrice}
                    />
                </Modal>
            </div>
        );
    }

}