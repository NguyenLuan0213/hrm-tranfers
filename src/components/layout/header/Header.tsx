import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Dropdown, Select, Badge } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { UserRoleProps, getUserRole } from './UserRole';
import useUserRole from '../../../hooks/UseUserRole';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
    const [roles, setRoles] = useState<UserRoleProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
    const [count, setCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<{ title: string, navigate: string }[]>([]);
    const navigate = useNavigate();

    const { userRole, setUserRole, setUserDepartment, updateCanEdit } = useUserRole();

    useEffect(() => {
        const fetchUserRoles = async () => {
            const data = await getUserRole();
            setRoles(data);
        };
        fetchUserRoles();

        // Read from localStorage
        const storedRole = localStorage.getItem('userRole');
        const storedDepartment = localStorage.getItem('userDepartment');

        if (storedRole && storedDepartment) {
            setSelectedRole(storedRole);
            setSelectedDepartment(storedDepartment);
            console.log(`Stored Role: ${storedRole} - ${storedDepartment}`);
        }
    }, [selectedRole, selectedDepartment]);

    const handleRoleChange = (value: number) => {
        const selected = roles.find(role => role.id === value);
        if (selected) {
            setSelectedRole(selected.role);
            setSelectedDepartment(selected.department);
            setUserRole(selected.role);
            setUserDepartment(selected.department);
            localStorage.setItem('userRole', selected.role);
            localStorage.setItem('userDepartment', selected.department);
            updateCanEdit(selected.role);
            console.log("có thay đổi");
        }
    };

    const getNotificationItems = (notifications: { title: string, navigate: string }[], navigate: (path: string) => void) => {
        return notifications.map((notification, index) => ({
            label: notification.title,
            key: index.toString(),
            icon: <NotificationOutlined />,
            onClick: (e: any) => { 
                navigate(notification.navigate); 
            },
        }));
    };
    
    const getMenuItems = (notifications: { title: string, navigate: string }[]): MenuProps['items'] => {
        console.log("menu", notifications);
        if (notifications.length > 0) {
            return getNotificationItems(notifications, navigate);
        } else {
            return [{
                label: 'No Notifications',
                key: '0',
                icon: <NotificationOutlined />,
                onClick: (e: any) => { /* Handle notification click */ },
            }];
        }
    };

    const menuProps = {
        items: getMenuItems(notifications),
        onClick: (e: any) => {
            setCount(0);
            setNotifications([]);
            if (userRole === 'Employee') {
                sessionStorage.setItem('notificationEmployee', JSON.stringify([]));
            } else if (userRole === 'Manager') {
                sessionStorage.setItem('notificationsManager', JSON.stringify([]));
            }
        },
    };

    useEffect(() => {
        if (userRole === 'Employee') {
            const handleReciveNotification = () => {
                // Retrieve thông báo từ sessionStorage
                let storedNotifications = JSON.parse(sessionStorage.getItem('notificationEmployee') || '[]');

                // Log thông báo
                console.log("Retrieved Notifications:", storedNotifications);
                setNotifications(storedNotifications);
                setCount(storedNotifications.length);
                console.log("count", storedNotifications.length);
            };
            handleReciveNotification();
        } else if (userRole === 'Manager') {
            const handleReciveNotification = () => {
                // Retrieve thông báo từ sessionStorage
                let storedNotifications = JSON.parse(sessionStorage.getItem('notificationsManager') || '[]');

                // Log thông báo
                console.log("Retrieved Notifications:", storedNotifications);
                setNotifications(storedNotifications);
                setCount(storedNotifications.length);
            };
            handleReciveNotification();
        } 
        else {
            setCount(0);
        }
    }, [userRole]);

    console.log("cc", notifications);

    return (
        <Header style={{
            position: 'fixed',
            zIndex: 999,
            backgroundColor: '#DDDDDD',
            width: '100%', // Adjusted to use full width
            padding: '0',
        }}>
            <Row>
                <Col span={6}>
                    <Select
                        style={{ marginLeft: 15, width: 220 }}
                        placeholder="Select Role"
                        onChange={handleRoleChange}
                        defaultValue={roles[0]?.id}
                    >
                        {roles.map(role => (
                            <Option key={role.id} value={role.id}>
                                {role.role} - {role.department}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                    Hello {selectedRole && selectedDepartment ? `${selectedRole} - ${selectedDepartment}` : "Guest"}
                </Col>
                <Col span={6}>
                    <div style={{ textAlign: 'end', marginRight: 20 }}>
                        <Dropdown menu={menuProps} placement="bottomRight" arrow>
                            <Button>
                                <Badge size="default" count={count}>
                                    <NotificationOutlined shape="square" style={{ fontSize: 25 }} />
                                </Badge>
                            </Button>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </Header>
    );
}

export default CustomHeader;