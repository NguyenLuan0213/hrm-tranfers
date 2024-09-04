import { Table, Space, Pagination, Button, Input, Row, Col, Modal } from "antd";
import { Employee } from "../data/EmployeesData";
import { getEmployees } from "../services/EmployeeServices";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDeleteEmployee } from "../hooks/useDeleteEmployees";
import { useUpdateEmployee } from "../hooks/useUpdateEmployees";
import UpdateForm from "./UpdateEmployeeForm";
import AddEmployeeForm from "./AddEmployeeForm";

const { Column } = Table;
const { Search } = Input;

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
    const handleUpdateEmployee = async (updatedEmployee: Employee) => {
        console.log('handleUpdateEmployee called with:', updatedEmployee);
        const success = await handleUpdate(updatedEmployee.id, updatedEmployee);
        if (success) {
            setIsUpdating(false);
            console.log('Cập nhật thành công:', updatedEmployee);
            const updatedEmployees = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
            setEmployees(updatedEmployees);
            setFilteredEmployees(updatedEmployees);
        }
    }

    // Hàm thêm nhân viên
    const handleAddEmployee = async (newEmployee: Employee) => {
        setEmployees(prev => [...prev, newEmployee]);
        setFilteredEmployees(prev => [...prev, newEmployee]);
        setIsAdding(false);
    };

    return (
        <div style={{ padding: '10px' }}>
            <h1>{"Danh sách nhân viên"}</h1>
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
                    onUpdate={handleAddEmployee}
                    onCancel={() => setIsAdding(false)}
                />
            </Modal>
        </div>
    );
}

export default EmployeeList;