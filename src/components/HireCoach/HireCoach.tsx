import * as React from 'react';
import { Form, Radio, Icon, Tooltip, InputNumber, Button } from 'antd';
import moment from 'moment';
import { Query } from 'react-apollo';
import { withApollo } from 'react-apollo';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const query = gql`
query Query($coach: String!) {
  plans(coach: $coach){
   _id
   monthlyPrice
  }
}`;

interface HireCoachProps {
     email: string;
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
  }

class HireCoach extends React.Component<HireCoachPropsFull & ApolloProps,
CoachState> {

constructor(props: HireCoachPropsFull & ApolloProps) {
    super(props);
    this.state = {
        isActiveModal: false,
        email: this.props.email
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

handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err: any, values: any) => {
        const month = values.numberOfMonths;
        const diff = moment().add('months', month);
        values.plan.dueDate = diff;
      //  values.plan.plan = idPlan;
        if (!err) {
            this.props.mutate({
                variables: { updatePlan: values }
            })
            .then(({ data }: any) => {
                console.log('got data');
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
    <Query
        query={query}
        variables={{
        coach: 'mariaentrenadora@gmail.com' // this.props.email
      } as any}
    >
    {({ loading, error, data }) => {
      if (loading) {
        return (<span>Loading...</span>);
      }
      if (!error && data) {
       console.log(data);
       return(
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
                            <Radio value="BASIC"> {/*el value sera el ID del plan que coja*/}
                            <span> Basic&nbsp; - Precio &nbsp;</span>
                            <Tooltip title="Entrenamiento online">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </Radio>
                          <br/>
                            <Radio value="STANDAR">Standar&nbsp;
                            <Tooltip title="Basic + quedadas con tu entrenador">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </Radio>    
                          <br/>                                                  
                            <Radio value="PREMIUM">Premium&nbsp;
                            <Tooltip title="Standard + test físico inicial en un centro cercano al usuario">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </Radio>  
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Numero de meses que desea contratar">
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

// export default Form.create()(HireCoach);
// export default Form.create()(withApollo<HireCoachPropsFull, {}>(HireCoach as any));
export default Form.create()(graphql<{}, HireCoachPropsFull>(hireCoachMutation)(HireCoach as any));
