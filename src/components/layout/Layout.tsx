import React from 'react';
import {
  SwapOutlined,
  TableOutlined,
  ApartmentOutlined,
  CheckOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import Header from './header/Header';
import { Outlet, useNavigate } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}

const App: React.FC = () => {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem('Danh Sách Nhân Viên', '1', <TableOutlined />, () => navigate('/employees')),
    getItem('Phòng Ban', '2', <ApartmentOutlined />, () => navigate('/departments')),
    getItem('Yêu cầu điều Chuyển', '3', <SwapOutlined />, () => navigate('/transfers')),
    getItem('Quyết định điều chuyển', '4', <CheckOutlined />, () => navigate('/transfers/decisions')),
    getItem('Thống kê, báo cáo', '5', <DashboardOutlined />, undefined, [
      getItem('Theo thời gian', '5-1', <ClockCircleOutlined />, () => navigate('/statistics')),
      getItem('Theo trạng thái đơn', '5-2', <FileSearchOutlined />, () => navigate('/statistics/status')),
    ]),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        width={250}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout style={{ marginLeft: 250 }}>
        <Header />
        <Content style={{ margin: '0 16px', paddingTop: 65 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', background: "#C0C0C0" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;