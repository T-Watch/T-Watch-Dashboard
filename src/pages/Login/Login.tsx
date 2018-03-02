import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox, Layout } from 'antd';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import './Login.css';
const FormItem = Form.Item;

interface Props {
  form: any;
  redirect: Function;
}

interface ApolloProps {
  client: any;
}

class Login extends React.Component<ApolloProps & Props, {}> {

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
          </Button>
            Or <a href="">register now!</a>
            <a className="login-form-forgot" href="">Forgot password</a>
          </FormItem>
        </Form>
      </Layout>
    );
  }

  private handleSubmit = async (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.submit(
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

  private submit = async (args: any, onError: Function) => {
    try {
      const { data } = await this.props.client.query({
        query: gql`query Query($email: String!, $password: String!) {
              token(email: $email, password: $password){
                error
                token
              }
            }`,
        variables: args
      });

      if (data.token.error) {
        throw new Error(data.token.error);
      }

      localStorage.setItem('token', data.token.token);
      localStorage.setItem('email', args.email);
      localStorage.setItem('type', args.type);

      this.props.redirect();
    } catch (e) {
      onError(e.message);
    }
  }
}

export default Form.create()(withApollo<Props, {}>(Login as any));