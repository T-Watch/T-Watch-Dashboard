import * as React from 'react';
import { Form, Radio, Icon, Tooltip, InputNumber, Button } from 'antd';
import moment from 'moment';
import { Query } from 'react-apollo';
import { withApollo, graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const queryuser = gql`
query Query($coach: String) {
  plans(coach: $coach){
   _id,
   type,
   monthlyPrice
  }
}`;
const query = gql`
query Query($email: String!) {
  user(email: $email){
    name
    lastName
    phoneNumber
    district
    province
  }
}`;

interface HireCoachProps {
     email: string;
     close: Function;
}
interface ApolloProps {
    client: any;
  }
interface HireCoachPropsFull extends HireCoachProps {
    form: any;
    mutate: Function;
}
interface CoachState {
     isActiveModal: boolean;
     email: string;
     district: string;
     province: string;
     close: Function;
  }

class HireCoach extends React.Component<HireCoachPropsFull & ApolloProps,
CoachState> {

constructor(props: HireCoachPropsFull & ApolloProps) {
    super(props);
    this.state = {
        isActiveModal: false,
        email: this.props.email,
        province: '',
        district: '',
        close: this.props.close
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

async componentDidMount() {
    const email = localStorage.getItem('email');
    try {
    const {data} = await this.props.client.query({
      query,
      variables: {
        email: email
      }
    });
    this.setState({district: data.user.district});
    this.setState({province: data.user.province});
    
}catch(e){
    console.error(e);
  }
  }

handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err: any, values: any) => {
        const month = values.numberOfMonths;
        const diff = moment().add('months', month);
        delete values.numberOfMonths;
        values.plan.dueDate = diff.toDate();
        values.district = this.state.district;
        values.province = this.state.province;
        values.email = localStorage.getItem('email');
      //  values.plan.plan = idPlan;
      console.log(values);
        if (!err) {
            this.props.mutate({
               variables: { updatePlan: values }
            })
            .then(({ data }: any) => {
                console.log('got data');
                console.log(data);
              }).catch((error: any) => {
                console.log('there was an error sending the query', error);
              });
           
        }
        this.state.close();
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
        <Query
          query={queryuser}
          variables={{
          coach: this.props.email
        } as any}
        >
        {({ loading, error, data }) => {
          
          if (!error && data) {
            let basic = { 
                price: 0, idPlan: '' 
            };
            let standar = { 
                price: 0, idPlan: '' 
            };
            let premium = { 
                price: 0, idPlan: '' 
            };
            
            if ((data as any).plans) {

            const plans = (data as any).plans;        
            for (var i = 0; i < plans.length; i++) {
                if (plans[i].type === 'BASIC') {
                    basic.price = plans[i].monthlyPrice;
                    basic.idPlan = plans[i]._id;
                } else if (plans[i].type === 'STANDAR') {
                    standar.price = plans[i].monthlyPrice;
                    standar.idPlan = plans[i]._id;   
                } else if (plans[i].type === 'PREMIUM') {
                    premium.price = plans[i].monthlyPrice;
                    premium.idPlan = plans[i]._id;                    
              }
            }
        }
            return (

              <div>       
                <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Elije de suscripción">
                                {getFieldDecorator('plan.plan', {
                                    initialValue: 'BASIC',
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Por favor, introduce el plan al que se va a suscribir'
                                        }
                                    ]
                                })(
                                    <RadioGroup> 
                                        <Radio value={basic.idPlan}> {/*el value sera el ID del plan que coja*/}
                                        <Tooltip title="Entrenamiento online">
                                        <Icon type="question-circle-o" />
                                        </Tooltip>
                                        <span> Basic&nbsp; - {basic.price}€/mes &nbsp;</span>
                                    </Radio>
                                    <br/>
                                        <Radio value={standar.idPlan}>
                                        <Tooltip title="Basic + quedadas con tu entrenador">
                                        <Icon type="question-circle-o" />
                                        </Tooltip>
                                        <span> Standar&nbsp; - {standar.price}€/mes &nbsp;</span> 
                                    </Radio>    
                                    <br/>                                                  
                                        <Radio value={premium.idPlan}>
                                        <Tooltip title="Standar + test físico inicial en un centro cercano al usuario">
                                        <Icon type="question-circle-o" />
                                        </Tooltip>
                                        <span> Premium&nbsp; - {premium.price}€/mes &nbsp;</span>    
                                    </Radio>  
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Deseo contratar ">
                        {getFieldDecorator('numberOfMonths', {
                            initialValue: 1,
                            rules: [
                                {
                                    required: true,
                                }
                            ]
                        }
                        )(<InputNumber
                            min={1}
                            max={24}
                        />)}
                        <span className="ant-form-text"> meses</span>
                        </FormItem> 
                        <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">Contratar</Button>
                        </FormItem>
                </Form>
            </div>  
        );
          }
          return <span>{error}</span>;
        }}
        </Query>
 );

}
}
const hireCoachMutation = gql`
mutation Mutation($updatePlan: UpdateUserInput!){
    updateUser(input: $updatePlan){
        name,
        lastName
    } 
}
`;

 //export default Form.create()(HireCoach);
//export default Form.create()(withApollo<HireCoachProps, {}>(HireCoach as any));

// export default Form.create()(graphql<{}, HireCoachPropsFull>(hireCoachMutation)(HireCoach as any));
export default Form.create()(compose(
    withApollo,
    graphql<{}, HireCoachPropsFull>(hireCoachMutation),
 )(HireCoach as any));
