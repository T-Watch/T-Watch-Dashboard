import * as React from 'react';
import { withApollo, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Layout, Menu, Icon, Avatar } from 'antd';
import Trainings from './Trainings';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';
import './App.css';

interface ApolloProps {
  client: any;
}

interface State {
  page: string;
}

const userQuery = gql`
  query Query ($email: String!, $coach: Boolean!) {
    user (email: $email) {
      name
      photo
    }
    trainings (coach: $email) @include(if: $coach) {
      registryDate
    }
    users (coach: $email) {
      name
      email
    }
  }
`;

class App extends React.Component<ApolloProps, State> {
  state: State = {
    page: 'dashboard'
  };

  public render() {
    console.log('App rendered');
    const login = (
      <Login
        submit={async (args: any, onError: Function) => {
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
            localStorage.setItem('type', 'COACH');
            this.forceUpdate();
          } catch (e) {
            onError(e.message);
          }
        }}
      />
    );
    if (!localStorage.getItem('token')) {
      return login;
    }
    let page = <Dashboard />;
    switch (this.state.page) {
      case 'trainings':
        page = <Trainings />;
        break;
      default:
        break;
    }
    return (
      <Query
        query={userQuery}
        variables={{
          email: localStorage.getItem('email'),
          coach: localStorage.getItem('type') === 'COACH'
        } as any}
      >
        {({ loading, error, data, _ }) => {
          if (loading) {
            return (<span>Loading...</span>);
          }
          if (!error && data) {
            console.log(data);
            const user = (data as any).user;
            const avatarProps = {
              icon: 'user',
              src: user.photo
            };

            return (
              <Layout style={{ height: '100vh' }}>
                <Layout.Sider collapsed={true} style={{ boxShadow: '3px 0 5px -2px #888' }}>
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.page]}
                    className="sider-menu"
                  >
                    <Menu.Item key="user">
                      <Avatar {...avatarProps} />
                    </Menu.Item>
                    <Menu.Item key="dashboard">
                      <Icon type="dashboard" onClick={() => this.setState({ page: 'dashboard' })} />
                      <span>Dashboard</span>
                    </Menu.Item>
                    <Menu.Item key="trainings">
                      <Icon type="solution" onClick={() => this.setState({ page: 'trainings' })} />
                      <span>Trainings</span>
                    </Menu.Item>
                    <Menu.Item key="customers">
                      <Icon type="team" onClick={() => this.setState({ page: 'customers' })} />
                      <span>Customers</span>
                    </Menu.Item>
                    <Menu.Item key="calendar">
                      <Icon type="calendar" onClick={() => this.setState({ page: 'calendar' })} />
                      <span>Calendar</span>
                    </Menu.Item>
                    <Menu.Item key="billing">
                      <Icon type="credit-card" onClick={() => this.setState({ page: 'billing' })} />
                      <span>Billing</span>
                    </Menu.Item>
                  </Menu>
                </Layout.Sider>
                <Layout.Content style={{ margin: '16px' }}>
                  {page}
                </Layout.Content>
              </Layout>
            );
          }
          return login;
        }}
      </Query>
    );
  }
}

export default withApollo<{}, State>(App);
