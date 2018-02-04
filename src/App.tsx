import * as React from 'react';
import { Layout, Menu, Icon, Card } from 'antd';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Layout.Sider collapsed={true} style={{ boxShadow: '3px 0 5px -2px #888' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} className="sider-menu">
            <Menu.Item key="dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="settings">
              <Icon type="setting" />
              <span>Settings</span>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content style={{ margin: '16px' }}>
          <Card style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Layout.Content>
      </Layout>
    );
  }
}

export default App;
