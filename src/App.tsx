import React, { useState } from 'react';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Image, ConfigProvider } from 'antd';
import './App.css';
import DashboardPage from './pages/dashboardPage';
import LogoImg from './assets/logo.png';



const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: '#fff',
          },
          Menu: {
            itemSelectedBg: "#fff"
          },
        },

      }}
    >
      <Layout className='full-screen-layout' >
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div >
            <Image
              className='mb-4 mt-4'
              preview={false}
              src={LogoImg}
            />
          </div>
          <Menu
            className='mt-4'
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}

            items={[
              {
                key: '1',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />

          </Header>
          <Content
            style={{
              margin: '12px',
              padding: 24,
              minHeight: 280,
              // borderRadius: borderRadiusLG,
              overflow: 'scroll'
            }}
          >
            <DashboardPage />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;