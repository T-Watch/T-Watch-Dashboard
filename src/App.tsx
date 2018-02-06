import * as React from 'react';
import { Layout, Menu, Icon, Avatar, Row, Col, List } from 'antd';
import { Card, InboxMessage } from './components';
import { InboxMessageProps } from './components/InboxMessage/InboxMessage';
import './App.css';

const fakeMessages: InboxMessageProps[] = [{
  from: 'Brais',
  subject: 'Necesito otro entrenamiento',
  date: new Date()
},
{
  from: 'Pichín',
  subject: 'Estás despedido',
  date: new Date()
},
{
  from: 'María',
  subject: 'Hola caracola',
  date: new Date()
}];

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
          <Row gutter={40}>
            <Col className="gutter-row" span={8}>
              <Card title="Inbox" icon="inbox" >
                <List
                  size="small"
                  dataSource={fakeMessages}
                  renderItem={(item: InboxMessageProps) => (
                    <InboxMessage from={item.from} subject={item.subject} date={item.date} />
                  )}
                />
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="Last training" icon="line-chart" >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="inbox" icon="inbox" >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }
}

export default App;
