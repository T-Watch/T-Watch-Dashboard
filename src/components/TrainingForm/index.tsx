import * as React from 'react';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, DatePicker, Icon, Select, Timeline } from 'antd';
import TrainingBlockModal from '../TrainingBlockModal';
import './TrainingForm.css';

const FormItem = Form.Item;

const mutation = gql`
  mutation Mutation ($training: TrainingInput!, $_ids: [String!]!) {
    training (input: $training){
      _id
      type
      user
      date
      maxDate
      description
      trainingBlocks{
        _id
        title
        distance
        duration
        maxHR
        minHR
        maxSpeed
        minSpeed
        altitude
        schema
      }
      completed
    }
    deleteTrainingBlocks (_ids: $_ids)
  }
`;

const query = gql`
  query Query ($coach: String!) {
    trainingBlocks (coach: $coach) {
      _id
      title
      distance
      duration
      maxHR
      minHR
      maxSpeed
      minSpeed
      altitude
      schema
    }
  }
`;

interface InnerProps {
  form: any;
  client: any;
}

interface Props {
  training?: any;
  onAdded: Function;
  onCancel: Function;
}

interface State {
  trainingBlocks: any[];
  modal: boolean;
  tBlockToEdit: any;
}

class TrainingForm extends React.Component<Props & InnerProps, State> {
  state: State = {
    trainingBlocks: [],
    modal: false,
    tBlockToEdit: {}
  };

  async componentDidMount() {
    try {
      const { data } = await this.props.client.query({ query, variables: { coach: localStorage.getItem('email') } });
      this.setState({ trainingBlocks: data.trainingBlocks.filter((e: any) => e.schema) });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    console.log('TrainingForm rendered');
    const { getFieldDecorator } = this.props.form;
    const tCopy = Object.assign(this.props.training || {}, {});
    
    const tBlocks = [<Select.Option key={'Create new Training Block'} >Create new Training Block</Select.Option>,
    [...this.state.trainingBlocks, ...(tCopy.trainingBlocks || [])].map((e: any) => (
      <Select.Option key={e._id}>{e.title}</Select.Option>
    ))];

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
              if (v) {
                const tb = v[v.length - 1];
                if (!tb) {
                  return v;
                }
                if (tb === 'Create new Training Block') {
                  this.setState({ modal: true });
                  return v.filter((e: any) => e !== 'Create new Training Block');
                }
                const o = { ...this.state.trainingBlocks.filter((e: any) => e._id === tb)[0] };
                if (o.schema) {
                  delete o._id;
                  delete o.schema;
                  this.editTBlock(o);
                  return v.filter((e: any) => e !== 'Create new Training Block' && e !== tb);
                } else {
                  return v;
                }
              }
              return v;
            }
          })(
            <Select
              mode="tags"
              placeholder="Choose the blocks of this training"
              allowClear={true}
            >
              {tBlocks}
            </Select>
          )}
        </FormItem>
        <Timeline>
          {this.props.form.getFieldValue('trainingBlocks') ?
            this.props.form.getFieldValue('trainingBlocks').map((e: string) => {
              for (let i = 0; i < this.state.trainingBlocks.length; i++) {
                const tblock = this.state.trainingBlocks[i];
                if (tblock._id === e) {
                  return <Timeline.Item key={tblock._id}>
                    <span
                      onClick={() => this.editTBlock(tblock)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tblock.title}
                    </span>
                  </Timeline.Item>;
                }
              }
              return null;
            }) : null
          }
        </Timeline>
        <div className="login-form-button-group">
          <Button type="primary" htmlType="submit" className="login-form-button">
            <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >{tCopy.type ? 'SAVE' : 'ADD'}</span>
          </Button>
          {tCopy.type ?
            <Button type="danger" onClick={() => this.props.onCancel()} className="login-form-button">
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
          onUpdated={(newTrainingBlock: any) => {
            const temp = [];
            for (let i = 0; i < this.state.trainingBlocks.length; i++) {
              if (this.state.trainingBlocks[i]._id === newTrainingBlock._id) {
                temp[i] = newTrainingBlock;
                continue;
              }
              temp[i] = this.state.trainingBlocks[i];
            }
            this.setState({ modal: false, trainingBlocks: temp });
          }}
          onCancel={() => this.setState({ modal: false, tBlockToEdit: {} })}
          tBlock={this.state.tBlockToEdit}
        />
      </Form>
    );
  }
  private handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        values.coach = localStorage.getItem('email');
        values.date = values.date.toString();
        values.maxDate = values.maxDate ? values.maxDate.toString() : undefined;
        if (this.props.training && this.props.training._id) {
          values._id = this.props.training._id;
        }
        const tBlocksToRemove = this.state.trainingBlocks.filter((t: any) =>
          !t.schema && values.trainingBlocks.indexOf(t._id) === -1).map((t: any) => t._id);
        try {
          const res = await this.props.client.mutate({
            mutation,
            variables: { training: values, _ids: tBlocksToRemove }
          });
          this.state.trainingBlocks = this.state.trainingBlocks.filter((t: any) =>
            t.schema || values.trainingBlocks.indexOf(t._id) !== -1);
          this.props.form.resetFields();
          this.props.onAdded();
          console.log(res);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  private editTBlock = async (tBlock: any) => {
    this.setState({ tBlockToEdit: tBlock, modal: true });
  }
}

export default withApollo<Props, {}>(Form.create()(TrainingForm));
