import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Dropdown, Space, Select } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { UserRoleProps, getUserRole } from './UserRole';
import Cookie from 'js-cookie';

const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
    const [roles, setRoles] = useState<UserRoleProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUserRoles = async () => {
            const data = await getUserRole();
            setRoles(data);
        };
        fetchUserRoles();
    }, []);

    const handleRoleChange = (value: number) => {
        const selected = roles.find(role => role.id === value);
        if (selected) {
            setSelectedRole(selected.role);
            setSelectedDepartment(selected.department);
            // Save to cookie
            Cookie.set('userRole', selected.role);
            Cookie.set('userDepartment', selected.department);
            console.log(`Selected Role: ${selected.role} - ${selected.department}`);
        }
    };

    // Dropdown menu items
    const items: MenuProps['items'] = [
        {
            label: 'User Profile',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: 'Settings',
            key: '2',
            icon: <SettingOutlined />,
        }
    ];

    const menuProps = {
        items,
        onClick: (e: any) => { /* Handle menu click */ },
    };

    return (
        <Header style={{
            position: 'fixed',
            zIndex: 999,
            backgroundColor: '#DDDDDD',
            width: '83.7%',
            padding: '0',
        }}>
            <Row>
                <Col span={8}>
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
                    Hello {selectedRole && selectedDepartment ? `${selectedRole} - ${selectedDepartment}` : "Gest"}
                </Col>
                <Col span={8} style={{ textAlign: 'end' }}>
                    <div style={{ marginRight: 15 }} >
                        <Dropdown menu={menuProps} >
                            <Button>
                                <Space>
                                    <UserOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </Header>
    );
}

export default CustomHeader;