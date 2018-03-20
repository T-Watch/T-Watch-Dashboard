import * as React from 'react';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, Icon, Modal, InputNumber, Checkbox } from 'antd';
import './TrainingBlockModal.css';

const FormItem = Form.Item;

const mutation = gql`
  mutation Mutation ($trainingBlock: TrainingBlockInput!) {
    trainingBlock (input: $trainingBlock){
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
  visible: boolean;
  onCreated: Function;
  onCancel: Function;
  onUpdated: Function;
  tBlock: any;
}

interface State {
}

class TrainingBlockModal extends React.Component<Props & InnerProps, State> {
  state: State = {
  };

  render() {
    console.log('TrainingBlockModal rendered');
    const { getFieldDecorator } = this.props.form;
    const { tBlock } = this.props;

    return (
      <Modal visible={this.props.visible} onCancel={() => this.props.onCancel()} closable={false} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="Coach">
            {getFieldDecorator('coach', { rules: [{ required: true }], initialValue: localStorage.getItem('email') })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                disabled={true}
              />
            )}
          </FormItem>
          <FormItem label="Title">
            {getFieldDecorator('title', { rules: [{ required: true }], initialValue: tBlock.title || undefined })(
              <Input placeholder="Training Block Title" />
            )}
          </FormItem>
          <FormItem label="Distance">
            {getFieldDecorator('distance', { initialValue: tBlock.distance || undefined })(
              <InputNumber placeholder="Meters" min={0} />
            )}
          </FormItem>
          <FormItem label="Duration">
            {getFieldDecorator('duration', { initialValue: tBlock.duration || undefined })(
              <InputNumber placeholder="Minutes" min={0} step={0.1} />
            )}
          </FormItem>
          <FormItem label="Max HR">
            {getFieldDecorator('maxHR', { initialValue: tBlock.maxHR || undefined })(
              <InputNumber placeholder="HR" min={0} />
            )}
          </FormItem>
          <FormItem label="Min HR">
            {getFieldDecorator('minHR', { initialValue: tBlock.minHR || undefined })(
              <InputNumber placeholder="HR" min={0} />
            )}
          </FormItem>
          <FormItem label="Max Speed">
            {getFieldDecorator('maxSpeed', { initialValue: tBlock.maxSpeed || undefined })(
              <InputNumber placeholder="Km/s" min={0} />
            )}
          </FormItem>
          <FormItem label="Min Speed">
            {getFieldDecorator('minSpeed', { initialValue: tBlock.minSpeed || undefined })(
              <InputNumber placeholder="Km/s" min={0} />
            )}
          </FormItem>
          <FormItem label="Altitude">
            {getFieldDecorator('altitude', { initialValue: tBlock.altitude || undefined })(
              <InputNumber placeholder="Meters" min={0} />
            )}
          </FormItem>
          <FormItem label="Schema">
            {getFieldDecorator('schema', { initialValue: tBlock.schema || undefined })(
              <Checkbox>Schema</Checkbox>
            )}
          </FormItem>
          <div className="login-form-button-group">
            <Button type="primary" htmlType="submit" className="login-form-button">
              <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >{tBlock.title ? 'SAVE' : 'ADD'}</span>
            </Button>
            <Button type="danger" onClick={() => this.props.onCancel()} className="login-form-button">
              <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >CANCEL</span>
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
  private handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        if (!values.duration && !values.distance) {
          this.props.form.setFields({
            duration: {
              errors: [new Error('Distance or duration required')],
            },
            distance: {
              errors: [new Error('Distance or duration required')],
            },
          });
          return;
        }
        values._id = this.props.tBlock._id;
        try {
          const res = await this.props.client.mutate({
            mutation,
            variables: { trainingBlock: values }
          });
          this.props.form.resetFields();
          if (this.props.tBlock.title) {
            this.props.onUpdated(res.data.trainingBlock);
          } else {
            this.props.onCreated(res.data.trainingBlock);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}

export default withApollo<Props, {}>(Form.create({})(TrainingBlockModal));
