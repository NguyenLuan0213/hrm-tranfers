import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Modal, message, Avatar } from "antd";
//import data
import { Employee } from "../data/employees_data";
import { Departments } from "../../phong-ban/data/department_data";
//import services
import { getDepartment } from "../../phong-ban/services/department_services";
import { getEmployeeById } from "../services/employee_services";
//import hooks
import { useDeleteEmployee } from "../hooks/use_delete_employees";
import { useUpdateEmployee } from "../hooks/use_update_employees";
//import components
import UpdateForm from "./UpdateEmployeeForm";
import EmployeeDetails from "./Card.EmployeeDetails";

const EmployeeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [department, setDepartment] = useState<Departments[]>([]);
    const navigate = useNavigate();

    const { handleDelete } = useDeleteEmployee();
    const { handleUpdate, loading: updating, error } = useUpdateEmployee();

    // Hàm lấy dữ liệu 
    const fetchData = async () => {
        try {
            setLoading(true);
            const employee = await getEmployeeById(parseInt(id!));
            setEmployee(employee || null);
            const deparment = await getDepartment();
            setDepartment(deparment || []);
        } catch (error) {
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu nhân viên khi trang được load
    useEffect(() => {
        fetchData();
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
    const handleUpdateEmployee = async (updatedEmployee: Employee, fileList: any[]) => {
        const success = await handleUpdate(updatedEmployee.id, updatedEmployee);

        console.log(success);
        if (success) {
            setIsUpdating(false); // Đóng form cập nhật sau khi thành công
            setEmployee(updatedEmployee); // Cập nhật thông tin nhân viên
            fetchData(); // Làm mới dữ liệu nhân viên sau khi cập nhật
            message.success('Cập nhật nhân viên thành công');
        } else {
            message.error('Cập nhật nhân viên thất bại');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '15px' }}>
            <EmployeeDetails
                employee={employee}
                department={department}
                onEdit={() => setIsUpdating(true)}
                onDelete={onDelete}
            />

            <Modal
                title={'Cập nhật nhân viên'}
                open={isUpdating}
                footer={null}
                onCancel={() => setIsUpdating(false)}
            >
                <UpdateForm
                    department={department}
                    employee={employee}
                    onUpdate={handleUpdateEmployee}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>
        </div>
    );
}

export default EmployeeDetail;