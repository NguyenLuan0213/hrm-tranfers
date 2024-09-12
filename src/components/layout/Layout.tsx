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
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  const items: MenuItem[] = [
    getItem('Danh Sách Nhân Viên', '1', <TableOutlined />, () => navigate('/employees')),
    getItem('Phòng Ban', '2', <ApartmentOutlined />, () => navigate('/departments')),
    getItem('Yêu cầu điều Chuyển', '3', <SwapOutlined />, () => navigate('/transfers/requests')),
    getItem('Quyết định điều chuyển', '4', <CheckOutlined />, () => navigate('/transfers/decisions')),
    getItem('Thống kê, báo cáo', '5', <DashboardOutlined />, undefined, [
      getItem('Theo thời gian', '5-1', <ClockCircleOutlined />, () => navigate('/statistics')),
      getItem('Theo trạng thái đơn', '5-2', <FileSearchOutlined />, () => navigate('/statistics/status')),
    ]),
  ];

  // Chuyển đổi key của menu item dựa vào pathname
  const getSelectedKey = (pathname: string): string => {
    if (pathname.includes('/employees')) {
      return '1';
    } else if (pathname.includes('/departments')) {
      return '2';
    } else if (pathname.includes('/transfers/requests')) {
      return '3';
    } else if (pathname.includes('/transfers/decisions')) {
      return '4';
    } else if (pathname.includes('/statistics/status')) {
      return '5-2';
    } else if (pathname.includes('/statistics')) {
      return '5-1';
    } else {
      return '1'; // Mặc định chọn menu item 'Danh Sách Nhân Viên'
    }
  };

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
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[getSelectedKey(location.pathname)]}
        />
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