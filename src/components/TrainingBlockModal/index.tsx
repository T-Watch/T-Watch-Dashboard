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
}

interface State {
}

class TrainingBlockModal extends React.Component<Props & InnerProps, State> {
  state: State = {
  };

  render() {
    console.log('TrainingBlockModal rendered');
    const { getFieldDecorator } = this.props.form;

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
            {getFieldDecorator('title', { rules: [{ required: true }] })(
              <Input placeholder="Training Block Title" />
            )}
          </FormItem>
          <FormItem label="Distance">
            {getFieldDecorator('distance')(
              <InputNumber placeholder="Meters" min={0} />
            )}
          </FormItem>
          <FormItem label="Duration">
            {getFieldDecorator('duration')(
              <InputNumber placeholder="Minutes" min={0} step={0.1} />
            )}
          </FormItem>
          <FormItem label="Max HR">
            {getFieldDecorator('maxHR')(
              <InputNumber placeholder="HR" min={0} />
            )}
          </FormItem>
          <FormItem label="Min HR">
            {getFieldDecorator('minHR')(
              <InputNumber placeholder="HR" min={0} />
            )}
          </FormItem>
          <FormItem label="Max Speed">
            {getFieldDecorator('maxSpeed')(
              <InputNumber placeholder="Km/s" min={0} />
            )}
          </FormItem>
          <FormItem label="Min Speed">
            {getFieldDecorator('minSpeed')(
              <InputNumber placeholder="Km/s" min={0} />
            )}
          </FormItem>
          <FormItem label="Altitude">
            {getFieldDecorator('altitude')(
              <InputNumber placeholder="Meters" min={0} />
            )}
          </FormItem>
          <FormItem label="Schema">
            {getFieldDecorator('schema')(
              <Checkbox>Schema</Checkbox>
            )}
          </FormItem>
          <div className="login-form-button-group">
            <Button type="primary" htmlType="submit" className="login-form-button">
              <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >ADD</span>
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
        try {
          const res = await this.props.client.mutate({
            mutation,
            variables: { trainingBlock: values }
          });
          this.props.form.resetFields();
          this.props.onCreated(res.data.trainingBlock);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}

export default Form.create()(withApollo<InnerProps, {}>(TrainingBlockModal as any)) as any;
