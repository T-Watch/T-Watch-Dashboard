import * as React from 'react';
import { Layout, Menu, Icon, Avatar } from 'antd';
import Dashboard from './Dashboard/Dashboard';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Layout.Sider collapsed={true} style={{ boxShadow: '3px 0 5px -2px #888' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} className="sider-menu">
            <Menu.Item key="user">
              <Avatar icon="user" />
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="trainings">
              <Icon type="solution" />
              <span>Trainings</span>
            </Menu.Item>
            <Menu.Item key="customers">
              <Icon type="team" />
              <span>Customers</span>
            </Menu.Item>
            <Menu.Item key="calendar">
              <Icon type="calendar" />
              <span>Calendar</span>
            </Menu.Item>
            <Menu.Item key="billing">
              <Icon type="credit-card" />
              <span>Billing</span>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content style={{ margin: '16px' }}>
          <Dashboard />
        </Layout.Content>
      </Layout>
    );
  }
}

export default App;
