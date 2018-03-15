import * as React from 'react';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, DatePicker, Icon, Select, Timeline } from 'antd';
import TrainingBlockModal from '../TrainingBlockModal';
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
      title
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
  modal: boolean;
}

class TrainingForm extends React.Component<Props & InnerProps, State> {
  state: State = {
    tCopy: {},
    trainingBlocks: [],
    modal: false
  };

  async componentDidMount() {
    try {
      const { data } = await this.props.client.query({ query, variables: { coach: localStorage.getItem('email') } });
      this.setState({ trainingBlocks: data.trainingBlocks });
    } catch (e) {
      console.error(e);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const props = this.props;
    if (nextProps.training && props.training && nextProps.training._id === props.training._id) {
      return;
    }
    if (!nextProps.training && !props.training) {
      return;
    }
    this.setState({ tCopy: nextProps.training || {} });
  }

  render() {
    console.log('TrainingForm rendered');
    const { getFieldDecorator } = this.props.form;
    const tCopy = this.state.tCopy;

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
              if (v && v[v.length - 1] === 'Create new Training Block') {
                this.setState({ modal: true });
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
                tBlocks.concat(this.state.trainingBlocks.map((e: any) => (
                  <Select.Option key={e._id}>{e.title}</Select.Option>
                )))
              }
            </Select>
          )}
        </FormItem>
        <Timeline>
          {this.props.form.getFieldValue('trainingBlocks') ?
            this.props.form.getFieldValue('trainingBlocks').map((e: string) => {
              for (let i = 0; i < this.state.trainingBlocks.length; i++) {
                const tblock = this.state.trainingBlocks[i];
                if (tblock._id === e) {
                  return <Timeline.Item key={tblock._id}>{tblock.title}</Timeline.Item>;
                }
              }
              return null;
            }) : null
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
        <TrainingBlockModal
          visible={this.state.modal}
          onCreated={(newTrainingBlock: any) => {
            const trainingBlocks = this.props.form.getFieldValue('trainingBlocks') || [];
            this.props.form.setFieldsValue({ trainingBlocks: [...trainingBlocks, newTrainingBlock._id] });
            this.setState({ modal: false, trainingBlocks: [...this.state.trainingBlocks, newTrainingBlock] });
          }}
          onCancel={() => this.setState({ modal: false })}
        />
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
