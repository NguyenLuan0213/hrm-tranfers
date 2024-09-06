import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Image, Spin, Button, Modal } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Employee } from "../data/EmployeesData";
import { getEmployeeById } from "../services/EmployeeServices";
import { useDeleteEmployee } from "../hooks/useDeleteEmployees";
import { useUpdateEmployee } from "../hooks/useUpdateEmployees";
import UpdateForm from "./UpdateEmployeeForm";

const { Text } = Typography;

const EmployeeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const { handleDelete } = useDeleteEmployee();
    const { handleUpdate, loading: updating, error } = useUpdateEmployee();

    // Hàm lấy dữ liệu nhân viên
    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const data = await getEmployeeById(parseInt(id!));
            setEmployee(data || null);
        } catch (error) {
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };
    
    // Lấy dữ liệu nhân viên khi trang được load
    useEffect(() => {
        fetchEmployee();
    }, [id]);

    if (loading) {
        return <Spin size="large" />;
    }

    if (!employee) {
        return <div>{"Nhân viên không tồn tại."}</div>;
    }

    // Hàm xóa nhân viên
    const onDelete = () => {
        handleDelete(parseInt(id!), () => {
            navigate("/employees"); // Điều hướng về trang danh sách nhân viên sau khi xóa thành công
        });
    };

    // Hàm cập nhật nhân viên
    const handleUpdateEmployee = async (updatedEmployee: Employee) => {
        const success = await handleUpdate(updatedEmployee.id, updatedEmployee);
        if (success) {
            setIsUpdating(false); // Đóng form cập nhật sau khi thành công
            fetchEmployee(); // Làm mới dữ liệu nhân viên sau khi cập nhật
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '15px' }}>
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
                        onClick={() => setIsUpdating(true)}
                    />,
                    <Button key="delete" icon={<DeleteOutlined />} onClick={onDelete} />
                ]}
            >
                <Text strong>ID:</Text> <Text>{employee.id}</Text><br />
                <Text strong>Tên:</Text> <Text>{employee.name}</Text><br />
                <Text strong>Email:</Text> <Text>{employee.email}</Text><br />
                <Text strong>SĐT:</Text> <Text>{employee.phone}</Text><br />
                <Text strong>Giới tính:</Text> <Text>{employee.gender ? 'Nữ' : 'Nam'}</Text><br />
                <Text strong>Ngày sinh:</Text> <Text>{employee.born ? new Date(employee.born).toDateString() : 'N/A'}</Text><br />
                <Text strong>Chức vụ:</Text> <Text>{employee.role}</Text><br />
                <Text strong>Phòng ban:</Text> <Text>{employee.idDepartment}</Text><br />
            </Card>

            <Modal
                title={'Cập nhật nhân viên'}
                open={isUpdating}
                footer={null}
                onCancel={() => setIsUpdating(false)}
            >
                <UpdateForm
                    employee={employee}
                    onUpdate={handleUpdateEmployee}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>
        </div>
    );
}

export default EmployeeDetail;