import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Dropdown, Select, Badge } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../../hooks/UserRoleContext';
import { getUser } from '../../../modules/nhan-vien/services/employee_services';

const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<{ title: string, navigate: string, userTo: number }[]>([]);
    const navigate = useNavigate();
    
    // Lấy dữ liệu từ context
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
        setSelectedDepartmentId
    } = useUserRole();
    const [users, setUsers] = useState<{ id: number, role: string, name: string, departmentId: number, department: string }[]>([]);

    // Lưu dữ liệu vào useState
    useEffect(() => {
        // Lấy dữ liệu nhân viên tương ứng
        const fetchUsers = async () => {
            const data = await getUser();
            setUsers(data);
        }
        fetchUsers();

        // Đọc dữ liệu đã lưu từ localStorage
        const storedRole = localStorage.getItem('userRole');
        const storedDepartment = localStorage.getItem('userDepartment');
        const storedName = localStorage.getItem('userName');
        const storedId = localStorage.getItem('userId');
        const storedDepartmentId = localStorage.getItem('userDepartmentId');

        // Lưu dữ liệu vào useState
        if (storedRole && storedDepartment && storedName && storedId && storedDepartmentId) {
            setSelectedRole(storedRole);
            setSelectedDepartment(storedDepartment);
            setSelectedName(storedName);
            setSelectedId(parseInt(storedId));
            setSelectedDepartmentId(parseInt(storedDepartmentId));
        }
    }, [setSelectedRole, setSelectedDepartment, setSelectedName, setSelectedId, setSelectedDepartmentId]);

    // Lưu dữ liệu vào localStorage
    const handleRoleChange = (value: number) => {
        // Chọn người dùng tương ứng
        const selected = users.find(role => role.id === value);
        // Lưu dữ liệu vào localStorage
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

    // Lấy dữ liệu từ localStorage nếu có sẵn
    useEffect(() => {
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

    // Phần notification
    // Set menuItem
    const getNotificationItems = (notifications: { title: string, navigate: string }[], navigate: (path: string) => void) => {
        return notifications.map((notification, index) => ({
            label: notification.title,
            key: index.toString(),
            icon: <NotificationOutlined />,
            onClick: (e: any) => {
                navigate(notification.navigate);
                handleNotificationClick(index);
            },
        }));
    };

    // Lấy menuItem
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

    // Thực hiện hành động khi click vào thông báo
    const handleNotificationClick = (index: number) => {
        let storedNotifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
        storedNotifications.splice(index, 1); // Xóa thông báo tại index đã chọn
        sessionStorage.setItem('notifications', JSON.stringify(storedNotifications));
        const filteredNotifications = storedNotifications.filter((notification: { userTo: number }) => notification.userTo === selectedId);
        setNotifications(filteredNotifications);
        setCount(filteredNotifications.length);
    };

    const menuProps = {
        items: getMenuItems(notifications),
    };

    // Nhận thông báo từ sessionStorage
    useEffect(() => {
        const handleReceiveNotification = () => {
            let storedNotifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
            if (storedNotifications.length > 0) {
                const filteredNotifications = storedNotifications.filter((notification: { role: string, userTo: number }) => {
                    return notification.userTo === selectedId && notification.role === selectedRole;
                });
                setNotifications(filteredNotifications);
                setCount(filteredNotifications.length);
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
