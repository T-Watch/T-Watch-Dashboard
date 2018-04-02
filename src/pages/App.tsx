import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Layout, Menu, Icon, Avatar } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Trainings from './Trainings';
import Customers from './Customers/Customers';
import TrainingsUser from './TrainingsUser';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';
import Coaches from './Coaches/Coaches';
import Billing from './Billing/Billing';
import './App.css';

interface ApolloProps {
}

interface State {
  page: string;
  email: string;
}

const userQuery = gql`
  query Query ($email: String!) {
    user (email: $email) {
      type
      name
      photo
    }
    users (coach: $email) {
      name
      email
    }
  }
`;

class App extends React.Component<ApolloProps, State> {
  state: State = {
    page: 'dashboard',
    email: 'mariamolgas@gmail.com'
  };

  public render() {
    console.log('App rendered');
    const queryComponent = (router: any) => {
      const q = new URLSearchParams(router.location.search);
      if (!localStorage.getItem('token') && !q.get('token')) {
        return <Login redirect={() => this.forceUpdate()} />;
      }
      if (q.get('token')) {
        localStorage.setItem('token', q.get('token') as string);
        localStorage.setItem('type', q.get('type') as string);
        localStorage.setItem('email', q.get('email') as string);
      }
      const route = router.match.params.page;
      let page = <Dashboard />;

      switch (router.match.params.page) {
        case 'dashboard':
          page = <Dashboard />;
          break;
        case 'trainings':
          if (localStorage.getItem('type') === 'COACH') {
            page = <Trainings />;
          } else if (localStorage.getItem('type') === 'USER') {
            page = <TrainingsUser />;
          }
          break;
        case 'coaches':
          let idCoach = '';
          if (q.get('id')) {
            idCoach = q.get('id') as string;
          }
          page = <Coaches email={idCoach} />;
          break;
        case 'billing':
          const coachEmail = localStorage.getItem('email');
          page = <Billing coach={coachEmail} />;
          break;
          case 'customers':
          page = <Customers/>;
          break;

        case 'logout':
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('type');
          return <Login redirect={() => this.forceUpdate()} />;

        default:
          break;
      }

      return (
        <Query
          query={userQuery}
          variables={{
            email: localStorage.getItem('email')
          } as any}
        >
          {({ loading, error, data, _ }) => {
            if (loading) {
              return (<span>Loading...</span>);
            }
            if (!error && data) {
              // console.log(data);
              const user = (data as any).user;
              localStorage.setItem('type', user.type);
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
                      {localStorage.getItem('type') === 'COACH' ?
                        <Menu.Item key="customers">
                          <Link to="/customers"><Icon type="team" /></Link>
                          <span>Customers</span>
                        </Menu.Item> : null
                      }
                      <Menu.Item key="calendar">
                        <Link to="/calendar"><Icon type="calendar" /></Link>
                        <span>Calendar</span>
                      </Menu.Item>
                      {localStorage.getItem('type') === 'COACH' ?
                        <Menu.Item key="billing">
                          <Link to="/billing"><Icon type="credit-card" /></Link>
                          <span>Billing</span>
                        </Menu.Item> : null
                      }
                      {localStorage.getItem('type') === 'USER' ?
                        <Menu.Item key="coaches">
                          <Link to="/coaches"><Icon type="team" /></Link>
                          <span>Coaches</span>
                        </Menu.Item> : null
                      }
                      <Menu.Item key="logout">
                        <Link to="/logout"><Icon type="logout" /></Link>
                        <span>Log out</span>
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
