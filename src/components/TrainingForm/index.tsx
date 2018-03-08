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

interface InnerProps {
  form: any;
  mutate: Function;
}

interface Props {
  training?: any;
}

interface State {
  tCopy: any;
}

class TrainingForm extends React.Component<Props & InnerProps, State> {
  state: State = {
    tCopy: {}
  };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ tCopy: nextProps.training || {} });
  }

  render() {
    console.log('TrainingForm rendered');
    const { getFieldDecorator } = this.props.form;
    const tCopy = this.state.tCopy;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Type">
          {getFieldDecorator('type', { rules: [{ required: true }], initialValue: tCopy.type })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Training type" />
          )}
        </FormItem>
        <FormItem label="User">
          {getFieldDecorator('user', { rules: [{ required: true }], initialValue: tCopy.user })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Trained user"
            />
          )}
        </FormItem>
        <FormItem label="Recommended date">
          {getFieldDecorator('date', {
            rules: [{ required: true }],
            initialValue: tCopy.date ? moment(new Date(tCopy.date)) : null
          })(
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
          {getFieldDecorator('maxDate', {
            initialValue: tCopy.maxDate ? moment(new Date(tCopy.maxDate)) : null
          })(
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
          {getFieldDecorator('description', { initialValue: tCopy.description })(
            <Input.TextArea placeholder="Give a little description about the training" />
          )}
        </FormItem>
        <div className="login-form-button-group">
          <Button type="primary" htmlType="submit" className="login-form-button">
            <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >{this.state.tCopy.type ? 'SAVE' : 'ADD'}</span>
          </Button>
          {this.state.tCopy.type ?
            <Button type="danger" onClick={() => this.setState({ tCopy: {} })} className="login-form-button">
              <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >CANCEL</span>
            </Button>
            : null
          }
        </div>
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

export default Form.create<Props>()(graphql<any, InnerProps>(mutation)(TrainingForm));
