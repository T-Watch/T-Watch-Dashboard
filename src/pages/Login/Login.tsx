import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './Login.css';
const FormItem = Form.Item;

interface Props {
  submit: Function;
  form: any;
}

class Login extends React.Component<Props, {}> {

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', required: true, message: 'Email required!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Password required!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }

  private handleSubmit = async (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        delete values.remember;
        this.props.submit(
          values,
          (s: string) => {
            this.props.form.setFields({
              email: {
                value: values.email,
                errors: [new Error(s)],
              },
              password: {
                value: values.password,
                errors: [new Error(s)],
              },
            });
          });
      }
    });
  }
}

export default Form.create()(Login);