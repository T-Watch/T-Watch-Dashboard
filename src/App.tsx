import * as React from 'react';
import { Layout, Menu, Icon, Avatar, Row, Col, List } from 'antd';
import { Card, InboxMessage, TrainingSummary } from './components';
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

const lastTraining = {
  person: 'Brais',
  distance: 1000,
  duration: 3600,
  type: 'running',
  completed: true,
  data: [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ]
};

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
                    <InboxMessage {...item} />
                  )}
                />
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="Last training" icon="line-chart" >
                <TrainingSummary {...lastTraining} />
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
