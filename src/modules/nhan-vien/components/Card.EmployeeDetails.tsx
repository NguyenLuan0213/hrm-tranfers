import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Image } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
//import data
import { Employee } from '../data/employees_data';
import { Departments } from '../../phong-ban/data/department_data'

const { Text } = Typography;

interface EmployeeDetailsProps {
    employee: Employee;
    department: Departments[];
    onEdit: () => void;
    onDelete: () => void;
}


const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, department, onEdit, onDelete }) => {
    const navigate = useNavigate();

    // Chuyển đổi idDepartment về số nếu cần thiết
    const departmentId = typeof employee.idDepartment === 'string' ? parseInt(employee.idDepartment) : employee.idDepartment;
    const departmentName = department.find(dep => dep.id === departmentId)?.name || 'Không xác định';
    
    return (
        <Card
            cover={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image width={300} src={employee.avatar} />
                </div>
            }
            title={'Chi tiết nhân viên'}
            style={{ width: 400 }}
            actions={[
                <Button
                    key="return"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/employees")}
                />,
                <Button
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={onEdit}
                />,
                <Button key="delete" icon={<DeleteOutlined />} onClick={onDelete} />
            ]}
        >
            <Text strong>ID:</Text> <Text>{employee.id}</Text><br />
            <Text strong>Tên:</Text> <Text>{employee.name}</Text><br />
            <Text strong>Username:</Text> <Text>{employee.username}</Text><br />
            <Text strong>Email:</Text> <Text>{employee.email}</Text><br />
            <Text strong>SĐT:</Text> <Text>{employee.phone}</Text><br />
            <Text strong>Giới tính:</Text> <Text>{employee.gender ? 'Nữ' : 'Nam'}</Text><br />
            <Text strong>Ngày sinh:</Text> <Text>{employee.born ? new Date(employee.born).toDateString() : 'N/A'}</Text><br />
            <Text strong>Chức vụ:</Text> <Text>{employee.role}</Text><br />
            <Text strong>Phòng ban:</Text> <Text>{departmentName}</Text><br />
        </Card>
    );
};

export default EmployeeDetails;