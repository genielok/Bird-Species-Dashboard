import React, { useState } from 'react';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Image, ConfigProvider } from 'antd';
import './App.css';
import LogoImg from './assets/logo.png';
import DashboardPage from './pages/dashboardPage';
import UploadAudioPage from './pages/uploadAudioPage';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';


const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            onClick={({ key }) => navigate(key)}
            selectedKeys={[location.pathname]}
            items={[
              {
                key: '/dashboard',
                icon: <PieChartOutlined />,
                label: 'Dashboard',
              },
              {
                key: '/upload',
                icon: <DashboardOutlined />,
                label: 'Analyzation',
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
              overflow: 'scroll'
            }}
          >
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadAudioPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};


const App: React.FC = () => (
  <Router basename="/Bird-Species-Dashboard">
    <AppLayout />
  </Router>
);

export default App;