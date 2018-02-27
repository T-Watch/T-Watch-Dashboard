import * as React from 'react';
import moment from 'moment';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, DatePicker, Icon } from 'antd';
import './TrainingForm.css';

const FormItem = Form.Item;

const mutation = gql`
  mutation Mutation ($training: TrainingInput!) {
    training (input: $training){
      coach
    }
  }
`;

interface Props {
  form: any;
  mutate: Function;
}

class TrainingForm extends React.Component<Props, {}> {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Type">
          {getFieldDecorator('type', { rules: [{ required: true }] })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Training type" />
          )}
        </FormItem>
        <FormItem label="User">
          {getFieldDecorator('user', { rules: [{ required: true }] })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Trained user"
            />
          )}
        </FormItem>
        <FormItem label="Recommended date">
          {getFieldDecorator('date', { rules: [{ required: true }] })(
            <DatePicker
              placeholder="Select date"
              showTime={true}
              className="date-form-input"
              format="DD/MM/YYYY HH:mm"
              disabledDate={(current) => current < moment().startOf('day')}
            />
          )}
        </FormItem>
        <FormItem label="Date limit">
          {getFieldDecorator('maxDate')(
            <DatePicker
              placeholder="Select date"
              showTime={true}
              className="date-form-input"
              format="DD/MM/YYYY HH:mm"
              disabledDate={(current) => current < moment().startOf('day')}
            />
          )}
        </FormItem>
        <FormItem label="Description">
          {getFieldDecorator('description')(
            <Input.TextArea placeholder="Give a little description about the training" />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button">
          <Icon type="plus" style={{ fontWeight: 'bold' }} />
        </Button>
      </Form>
    );
  }
  private handleSubmit = async (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        values.coach = localStorage.getItem('email');
        values.date = values.date.toString();
        values.maxDate = values.maxDate ? values.maxDate.toString() : undefined;
        try {
          const res = await this.props.mutate({
            variables: { training: values }
          });
          this.props.form.resetFields();
          console.log(res);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}

export default Form.create()(graphql<any, Props>(mutation)(TrainingForm));
