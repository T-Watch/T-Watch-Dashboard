import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Layout, Menu, Icon, Avatar } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Trainings from './Trainings';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';
import './App.css';

interface ApolloProps {
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
    if (!localStorage.getItem('token')) {
      return <Login redirect={() => this.forceUpdate()} />;
    }
    const queryComponent = (router: any) => {
      const q = new URLSearchParams(router.location.search);
      if (q.get('token')) {
        localStorage.setItem('token', q.get('token') as string);
        localStorage.setItem('type', q.get('type') as string);
        localStorage.setItem('email', q.get('email') as string);
      }

      let page = <Dashboard />;
      const route = router.match.params.page;
      switch (router.match.params.page) {
        case 'dashboard':
          page = <Dashboard />;
          break;
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
                      selectedKeys={[route || 'dashboard']}
                      className="sider-menu"
                    >
                      <Menu.Item key="user">
                        <Avatar {...avatarProps} />
                      </Menu.Item>
                      <Menu.Item key="dashboard">
                        <Link to="/dashboard"><Icon type="dashboard" /></Link>
                        <span>Dashboard</span>
                      </Menu.Item>
                      <Menu.Item key="trainings">
                        <Link to="/trainings"><Icon type="solution" /></Link>
                        <span>Trainings</span>
                      </Menu.Item>
                      <Menu.Item key="customers">
                        <Link to="/customers"><Icon type="team" /></Link>
                        <span>Customers</span>
                      </Menu.Item>
                      <Menu.Item key="calendar">
                        <Link to="/calendar"><Icon type="calendar" /></Link>
                        <span>Calendar</span>
                      </Menu.Item>
                      <Menu.Item key="billing">
                        <Link to="/billing"><Icon type="credit-card" /></Link>
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
            return <Login redirect={() => this.forceUpdate()} />;
          }}
        </Query>
      );
    };

    return (
      <Router>
        <div>
          <Route exact={true} path="/" component={queryComponent} />
          <Route path="/:page" component={queryComponent} />
        </div>
      </Router >
    );
  }
}

export default App;
