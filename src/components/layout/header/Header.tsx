import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Dropdown, Select, Badge } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../../hooks/UserRoleContext';
import { getUser } from '../../../modules/nhan-vien/services/EmployeeServices';

const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<{ title: string, navigate: string, userTo: number }[]>([]);
    const navigate = useNavigate();
    const {
        selectedRole,
        selectedDepartment,
        selectedName,
        selectedId,
        selectedDepartmentId,
        setSelectedRole,
        setSelectedDepartment,
        setSelectedName,
        setSelectedId,
        setSelectedDepartmentId } = useUserRole();
    const [users, setUsers] = useState<{ id: number, role: string, name: string, departmentId: number, department: string }[]>([]);

    useEffect(() => {
        console.log('selected:', selectedRole, selectedDepartment, selectedName, selectedId, selectedDepartmentId);

    }, [selectedRole, selectedDepartment, selectedName, selectedId, selectedDepartmentId]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUser();
            setUsers(data);
        }
        fetchUsers();

        // Read from localStorage
        const storedRole = localStorage.getItem('userRole');
        const storedDepartment = localStorage.getItem('userDepartment');
        const storedName = localStorage.getItem('userName');
        const storedId = localStorage.getItem('userId');
        const storedDepartmentId = localStorage.getItem('userDepartmentId');

        if (storedRole && storedDepartment && storedName && storedId && storedDepartmentId) {
            setSelectedRole(storedRole);
            setSelectedDepartment(storedDepartment);
            setSelectedName(storedName);
            setSelectedId(parseInt(storedId));
            setSelectedDepartmentId(parseInt(storedDepartmentId));
            console.log(`Stored Role: ${storedRole} - ${storedDepartment}  - ${storedName} - ${storedId} - ${storedDepartmentId}`);
        }
    }, [setSelectedRole, setSelectedDepartment, setSelectedName, setSelectedId, setSelectedDepartmentId]);

    const handleRoleChange = (value: number) => {
        const selected = users.find(role => role.id === value);
        if (selected) {
            setSelectedRole(selected.role);
            setSelectedDepartment(selected.department);
            setSelectedName(selected.name);
            setSelectedId(selected.id);
            setSelectedDepartmentId(selected.departmentId);
            localStorage.setItem('userRole', selected.role);
            localStorage.setItem('userDepartment', selected.department);
            localStorage.setItem('userName', selected.name);
            localStorage.setItem('userId', selected.id.toString());
            localStorage.setItem('userDepartmentId', selected.departmentId.toString());
        }
    };

    useEffect(() => {
        // Fetch stored data on component mount
        const storedRole = localStorage.getItem('userRole');
        const storedDepartment = localStorage.getItem('userDepartment');
        const storedName = localStorage.getItem('userName');
        const storedId = localStorage.getItem('userId');
        const storedDepartmentId = localStorage.getItem('userDepartmentId');
        if (storedRole && storedDepartment && storedName && storedId) {
            setSelectedRole(storedRole);
            setSelectedDepartment(storedDepartment);
            setSelectedName(storedName);
            setSelectedId(parseInt(storedId));
            setSelectedDepartmentId(parseInt(storedDepartmentId || '0'));
        }
    }, [setSelectedRole, setSelectedDepartment, setSelectedName, setSelectedId, setSelectedDepartmentId]);

    //Phần notification
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

    const getMenuItems = (notifications: { title: string, navigate: string, userTo: number }[]): MenuProps['items'] => {
        if (notifications.length > 0) {
            return getNotificationItems(notifications, navigate);
        } else {
            return [{
                label: 'No Notifications',
                key: '0',
                icon: <NotificationOutlined />,
                onClick: (e: any) => { },
            }];
        }
    };

    const menuProps = {
        items: getMenuItems(notifications),
        onClick: (e: any) => {
            setCount(0);
            setNotifications([]);
            sessionStorage.setItem('notifications', JSON.stringify([]));
        },
    };

    useEffect(() => {
        const handleReceiveNotification = () => {
            let storedNotifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
            if (storedNotifications.length > 0) {
                if (selectedRole === "Nhân viên" && storedNotifications[0].role === "Nhân viên" && selectedId === storedNotifications[0].userTo) {
                    setNotifications(storedNotifications);
                    setCount(storedNotifications.length);
                } else if (selectedRole === "Quản lý" && storedNotifications[0].role === "Quản lý" && selectedId === storedNotifications[0].userTo) {
                    setNotifications(storedNotifications);
                    setCount(storedNotifications.length);
                } else {
                    setCount(0);
                }
            } else {
                setCount(0);
            }
        };

        handleReceiveNotification();
    }, [selectedRole, selectedId]);

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
                        style={{ marginLeft: 15, width: 400 }}
                        placeholder="Select Role"
                        onChange={handleRoleChange}
                        value={users.find(
                            user => user.role === selectedRole &&
                                user.department === selectedDepartment &&
                                user.name === selectedName)?.id}
                    >
                        {users.map(user => (
                            <Option key={user.id} value={user.id}>
                                {user.role} - {user.department} - {user.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                    Hello {selectedRole && selectedDepartment && selectedName ?
                        `${selectedName} - ${selectedRole} - ${selectedDepartment} ` : "Guest"}
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