import * as React from 'react';
import { Form, InputNumber, Button } from 'antd';
import { withApollo, graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
const FormItem = Form.Item;

interface UpdatePlanProps {
    type: string;
    monthlyPrice: number;  
    coach: string;
    close: Function;
}

interface UpdatePlanPropsFull extends UpdatePlanProps {
    form: any;
    mutate: Function;
}
interface UpdatePlanState {
    monthlyPrice: number;
    close: Function;
    _id: string;
}

interface ApolloProps {
    client: any;
  }
const query = gql`
  query Query($coach: String) {
    plans(coach: $coach){
      _id
      type
    }
  }`;

class UpdatePlan extends React.Component<UpdatePlanPropsFull & ApolloProps,
UpdatePlanState> {

constructor(props: UpdatePlanPropsFull & ApolloProps) {
    super(props);
    this.state = {
        monthlyPrice: this.props.monthlyPrice,
        close: this.props.close,
        _id: ''
      };
}

async componentDidMount() {

    if (this.props.monthlyPrice !== 0) {
    try {
        const { data } = await this.props.client.query({
          query,
          variables: {
            coach: this.props.coach
          }
        });
        const plans = data.plans;
        for (const plan of plans) {
            if (plan.type === this.props.type) {
             this.setState({ _id: plan._id});   
            }
        }
     } catch (e) {
       //  console.error(e);
      }
    
}
}

handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err: any, values: any) => {
        if (this.props.monthlyPrice !== 0) {
        values._id = this.state._id;
        }
        values.coach = this.props.coach;
        values.type = this.props.type;
        const newMonthlyPrice = values.monthlyPrice;
        if (!err) {
           this.props.mutate({
                variables: { updatePlan: values }
            })
            .then(({ data }: any) => {
                this.state.close(newMonthlyPrice);
              }).catch((error: any) => {
               // console.log('there was an error sending the query', error);
              });
        }
    });
}

render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24
            },
            sm: {
                span: 8
            }
        },
        wrapperCol: {
            xs: {
                span: 24
            },
            sm: {
                span: 16
            }
        }
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 16,
                offset: 8
            }
        }
    };
    return(
        <div>
            
      <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Añadir precio mensual">
            {getFieldDecorator('monthlyPrice', {
                initialValue: this.props.monthlyPrice,
                rules: [
                    {
                        required: true,
                    }
                ]
            }
            )(<InputNumber
                min={1}
                max={1000}
            />)}
            <span className="ant-form-text"> €/mes</span>
            </FormItem> 
            <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Añadir</Button>
            </FormItem>
      </Form>
    </div>  
  );
 
}
}
const updatePlanMutation = gql`
mutation Mutation($updatePlan: PlanInput){
    plan(input: $updatePlan){
        _id,
        coach,
        type
    } 
}
`;

// export default Form.create()(UpdatePlan);
// export default Form.create()(withApollo<UpdatePlanPropsFull, {}>(UpdatePlan as any));
// export default Form.create()(graphql<{}, UpdatePlanPropsFull>(updatePlanMutation)(UpdatePlan as any));
export default Form.create()(compose(
    withApollo,
    graphql<{}, UpdatePlanPropsFull>(updatePlanMutation),
 )(UpdatePlan as any));