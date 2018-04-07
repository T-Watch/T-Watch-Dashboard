import * as React from 'react';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Form, Button, Input, Modal } from 'antd';
import './MessageModal.css';

const FormItem = Form.Item;

const mutation = gql`
  mutation Mutation ($message: MessageInput!) {
    message (input: $message){
      _id
    }
  }
`;

interface InnerProps {
  form: any;
  client: any;
}

interface Props {
  visible: boolean;
  onCancel: Function;
  message: any;
}

interface State {
}

class MessageModal extends React.Component<Props & InnerProps, State> {
  state: State = {
  };

  render() {
    console.log('MessageModal rendered');
    const { getFieldDecorator } = this.props.form;
    const { message } = this.props;
    if (message) {
      const lineStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-evenly', marginBottom: 15 };
      const labelStyle: React.CSSProperties = { fontWeight: 'bold' };
      return (
        <Modal visible={this.props.visible} onCancel={() => this.props.onCancel()} closable={false} footer={null}>
          <div style={lineStyle}>
            <span style={labelStyle}>From: </span>
            <span>{message.from}</span>
          </div>
          <div style={lineStyle}>
            <span style={labelStyle}>Subject: </span>
            <span>{message.subject}</span>
          </div>
          <div style={{ textAlign: 'center' }}>{message.body}</div>
        </Modal>
      );
    }
    return (
      <Modal visible={this.props.visible} onCancel={() => this.props.onCancel()} closable={false} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="To">
            {getFieldDecorator('to', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Subject">
            {getFieldDecorator('subject', { rules: [{ required: true }] })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Body">
            {getFieldDecorator('body', { rules: [{ required: true }] })(
              <Input.TextArea />
            )}
          </FormItem>
          <div className="login-form-button-group">
            <Button type="primary" htmlType="submit" className="login-form-button">
              <span style={{ letterSpacing: 1.5, fontWeight: 'bold' }} >SEND</span>
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
        values.from = localStorage.getItem('email');
        try {
          await this.props.client.mutate({
            mutation,
            variables: { message: values }
          });
          this.props.form.resetFields();
          this.props.onCancel();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}

export default withApollo<Props, {}>(Form.create({})(MessageModal));
