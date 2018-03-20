import * as React from 'react';
import { Form, InputNumber, Button } from 'antd';
import { graphql } from 'react-apollo';
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
    type: string;
    monthlyPrice: number;  
    coach: string;
    close: Function;
  }

class UpdatePlan extends React.Component<UpdatePlanPropsFull,
UpdatePlanState> {

constructor(props: UpdatePlanPropsFull) {
    super(props);
    this.state = {
        coach: this.props.coach,
        type: this.props.type,
        monthlyPrice: this.props.monthlyPrice,
        close: this.props.close
      };
}

handleHire = () => {
    //
  }

handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err: any, values: any) => {
        values.coach = this.props.coach;
        values.type = this.props.type;
        console.log(values);
      //  values.plan.plan = idPlan;
        if (!err) {
            this.props.mutate({
                variables: { updatePlan: values }
            })
            .then(({ data }: any) => {
                console.log(data);
                this.state.close();
              }).catch((error: any) => {
                console.log('there was an error sending the query', error);
              });
           // console.log('Usuario: \n', values);
            /*this.props.mutate({
                variables: { user: values }
            })
            .then(({ data }: any) => {
              //  console.log('got data');
              }).catch((error: any) => {
             //   console.log('there was an error sending the query', error);
              });
          //  this.state.close();
            // console.log('Received values of form: ', values);*/
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
                initialValue: 1,
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

//export default Form.create()(UpdatePlan);
// export default Form.create()(withApollo<UpdatePlanPropsFull, {}>(UpdatePlan as any));
export default Form.create()(graphql<{}, UpdatePlanPropsFull>(updatePlanMutation)(UpdatePlan as any));
