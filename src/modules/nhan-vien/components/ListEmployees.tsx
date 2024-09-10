import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Pagination, Button, Input, Row, Col, Modal, Typography, Alert, message } from "antd";
import dayjs from "dayjs";
//import data
import { Employee } from "../data/employees_data";
import { Departments } from "../../phong-ban/data/department_data";
//import services
import { getEmployees, addEmployee } from "../services/employee_services";
import { getDepartment } from "../../phong-ban/services/department_services";
//import hooks
import { useDeleteEmployee } from "../hooks/use_delete_employees";
import { useUpdateEmployee } from "../hooks/use_update_employees";
//import components
import UpdateForm from "./UpdateEmployeeForm";
import AddEmployeeForm from "./AddEmployeeForm";

const { Column } = Table;
const { Search } = Input;
const { Title } = Typography;

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [department, setDepartment] = useState<Departments[]>([]);

    const { handleDelete } = useDeleteEmployee();
    const { handleUpdate, loading: updating, error } = useUpdateEmployee();

    // Lấy danh sách nhân viên
    useEffect(() => {
        const fetchData = async () => {
            const data = await getEmployees();
            setEmployees(data);
            setTotal(data.length);
            setFilteredEmployees(data);
        };
        fetchData();
    }, []);

    // Lọc dữ liệu nhân viên
    useEffect(() => {
        const filteredData = employees.filter(employee =>
            employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.phone.includes(searchText)
        );
        setFilteredEmployees(filteredData);
        setTotal(filteredData.length);
        setCurrent(1);
    }, [searchText, employees]);

    // Hàm phân trang
    const onChange = (page: number, pageSize: number | undefined) => {
        setCurrent(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    // Hiển thị dữ liệu phân trang
    const paginated = filteredEmployees.slice((current - 1) * pageSize, current * pageSize);

    // Hàm cập nhật nhân viên
    const handleUpdateEmployee = async (updatedEmployee: Employee, fileList: any[]) => {
        try {
            const success = await handleUpdate(updatedEmployee.id, updatedEmployee);
            if (success) {
                const updatedEmployees = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
                setEmployees(updatedEmployees);
                setFilteredEmployees(updatedEmployees);
                message.success('Cập nhật nhân viên thành công');
            } else {
                message.error('Cập nhật nhân viên thất bại');
            }
        } catch (error) {
            message.error('Cập nhật nhân viên thất bại');
        } finally {
            setIsUpdating(false);
        }
    };

    // Hàm thêm nhân viên
    const handleAddEmployee = async (values: any, fileList: any[]) => {
        const born = values.born ? dayjs(values.born).format('YYYY-MM-DD') : undefined;
        let avatarBase64 = undefined;
        if (fileList[0]?.originFileObj) {
            avatarBase64 = await getBase64(fileList[0].originFileObj);
        } // Nếu có file thì chuyển thành base64
        const employee: Employee = {
            ...values,
            born,
            status: true,
            avatar: avatarBase64,
        };
        try {
            const addedEmployee = await addEmployee(employee);
            setEmployees(prev => [...prev, addedEmployee]);
            setFilteredEmployees(prev => [...prev, addedEmployee]);
            setIsAdding(false);
            alert('Thêm nhân viên mới thành công');
        } catch (error) {
            console.error(error);
            alert('Thêm nhân viên mới thất bại');
        }
    };

    // Hàm chuyển file thành base64
    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    //Lấy danh sách phòng ban
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDepartment();
            setDepartment(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            <Title level={2}>{"Danh sách nhân viên"}</Title>
            <Row style={{ marginBottom: '15px' }}>
                <Col span={8}>
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm"
                        allowClear
                        enterButton="Tìm kiếm"
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                    <Button type="primary" onClick={() => setIsAdding(true)} style={{ marginRight: 20 }}>
                        Thêm Nhân Viên
                    </Button>
                </Col>
            </Row>
            <Table
                dataSource={paginated}
                pagination={false}
                rowKey="id"
            >
                <Column title="ID" dataIndex="id" key="id" />
                <Column title="Tên" dataIndex="name" key="name" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="SĐT" dataIndex="phone" key="phone" />
                <Column title="Chức vụ" dataIndex="role" key="role" />
                <Column
                    title="Chức năng"
                    key="action"
                    render={(text, record: Employee) => (
                        <Space size="middle">
                            <Link to={`/employees/detail/${record.id}`}>
                                <Button type="primary">
                                    Chi tiết
                                </Button>
                            </Link>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setSelectedEmployee(record);
                                    setIsUpdating(true);
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Button
                                type="primary"
                                danger
                                onClick={() => handleDelete(record.id, () => {
                                    setEmployees(prev => prev.filter(emp => emp.id !== record.id));
                                })}
                            >
                                Xóa
                            </Button>
                        </Space>
                    )}
                />
            </Table>
            <Pagination
                showSizeChanger
                showQuickJumper
                onChange={onChange}
                onShowSizeChange={onChange}
                current={current}
                pageSize={pageSize}
                total={total}
                style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}

            />

            <Modal
                title={"Cập nhật nhân viên"}
                open={isUpdating}
                footer={null}
                onCancel={() => setIsUpdating(false)}
            >
                {selectedEmployee && (
                    <UpdateForm
                        department={department}
                        employee={selectedEmployee}
                        onUpdate={handleUpdateEmployee}
                        onCancel={() => setIsUpdating(false)}
                    />
                )}
            </Modal>

            <Modal
                title={"Thêm mới nhân viên"}
                open={isAdding}
                footer={null}
                onCancel={() => setIsAdding(false)}
            >
                <AddEmployeeForm
                    Department={department}
                    onFinish={handleAddEmployee}
                    onCancel={() => setIsAdding(false)}
                />
            </Modal>
        </div>
    );
}

export default EmployeeList;