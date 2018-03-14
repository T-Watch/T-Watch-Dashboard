import * as React from 'react';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, DatePicker, Icon, Select, Timeline } from 'antd';
import './TrainingForm.css';

const FormItem = Form.Item;

const mutation = gql`
  mutation Mutation ($training: TrainingInput!) {
    training (input: $training){
      coach
    }
  }
`;

const query = gql`
  query Query ($coach: String!) {
    trainingBlocks (coach: $coach) {
      _id
    }
  }
`;

interface InnerProps {
  form: any;
  client: any;
}

interface Props {
  training?: any;
}

interface State {
  tCopy: any;
  trainingBlocks: any[];
}

class TrainingForm extends React.Component<Props & InnerProps, State> {
  state: State = {
    tCopy: {},
    trainingBlocks: []
  };

  async componentDidMount() {
    try {
      const { data } = await this.props.client.query({ query, variables: { coach: localStorage.getItem('email') } });
      this.setState({ trainingBlocks: data });
    } catch (e) {
      console.error(e);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ tCopy: nextProps.training || {} });
  }

  render() {
    console.log('TrainingForm rendered');
    const { getFieldDecorator } = this.props.form;
    const tCopy = this.state.tCopy;
    tCopy.trainingBlocks = [{ _id: 'jiji' }];

    const tBlocks = [<Select.Option key={'Create new Training Block'} >Create new Training Block</Select.Option>];

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
        <FormItem label="Training Blocks">
          {getFieldDecorator('trainingBlocks', {
            rules: [{ required: true }],
            initialValue: tCopy.trainingBlocks ? tCopy.trainingBlocks.map((e: any) => e._id) : undefined,
            normalize: (v: any, pv: any, allvalues: any) => {
              console.log(v);
              if (v && v[v.length - 1] === 'Create new Training Block') {
                // Call new training Block method
                return v.filter((e: any) => e !== 'Create new Training Block');
              }
              return v;
            }
          })(
            <Select
              mode="tags"
              placeholder="Choose the blocks of this training"
              allowClear={true}
            >
              {
                tCopy.trainingBlocks ?
                  tBlocks.concat(tCopy.trainingBlocks.map((e: any) => (
                    <Select.Option key={e._id} >{e._id}</Select.Option>
                  )))
                  : tBlocks
              }
            </Select>
          )}
        </FormItem>
        <Timeline>
          {this.props.form.getFieldValue('trainingBlocks') ?
            this.props.form.getFieldValue('trainingBlocks').map((e: any) => (
              <Timeline.Item key={e}>{e}</Timeline.Item>
            )) : null
          }
        </Timeline>
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
          const res = await this.props.client.mutate({
            mutation,
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

export default Form.create()(withApollo<InnerProps, {}>(TrainingForm as any)) as any;
