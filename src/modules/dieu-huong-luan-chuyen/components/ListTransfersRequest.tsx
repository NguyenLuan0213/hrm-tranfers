import { Table, Space, Button, Input, Row, Col, Tag, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { TransfersRequest, getTransfersRequestData } from "../data/TransfersRequest";
import { Employee, getEmployees } from "../../nhan-vien/data/EmployeesData";
import { Departments, getDepartment } from "../../phong-ban/data/DepartmentData";
import { Link } from "react-router-dom";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import AddTransfersRequestForm from "./AddTransferRequestForm";

const { Search } = Input;

const getStatusTag = (status: string) => {
    switch (status) {
        case 'DRAFT':
            return <Tag color="default">DRAFT</Tag>;
        case 'PENDING':
            return <Tag color="blue">PENDING</Tag>;
        case 'EDITING':
            return <Tag color="orange">EDITING</Tag>;
        case 'APPROVED':
            return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
            return <Tag color="red">REJECTED</Tag>;
        case 'CANCELLED':
            return <Tag color="gray">CANCELLED</Tag>;
        default:
            return <Tag color="default">{status}</Tag>;
    }
};

const ListTransfersEmployees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [transfersRequest, setTransfersRequest] = useState<TransfersRequest[]>([]);
    const [filteredTransfersRequest, setFilteredTransfersRequest] = useState<TransfersRequest[]>([]);
    const [departments, setDepartments] = useState<Departments[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("");
    const [userDepartment, setUserDepartment] = useState<string>("");
    const [pageSize, setPageSize] = useState<number>(10); // State để lưu số lượng mục hiển thị trên mỗi trang
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setUserRole(Cookies.get('userRole') || '');
        setUserDepartment(Cookies.get('userDepartment') || '');
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const transferData = await getTransfersRequestData();
            const uniqueTransfers = transferData.filter((value, index, self) =>
                index === self.findIndex((t) => t.id === value.id)
            );
            setTransfersRequest(uniqueTransfers);
            setFilteredTransfersRequest(uniqueTransfers);
            console.log(uniqueTransfers);
        };
        fetchData();
    }, []);
    

    useEffect(() => {
        const fetchData = async () => {
            const employeeData = await getEmployees();
            const departmentData = await getDepartment();
            setEmployees(employeeData);
            setDepartments(departmentData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filteredData = transfersRequest.filter(item => {
            const employeeName = employees.find(emp => emp.id === item.createdByEmployeeId)?.name || '';
            const approverName = employees.find(emp => emp.id === item.approverId)?.name || '';
            const departmentFromName = departments.find(dep => dep.id === item.departmentIdFrom)?.name || '';
            const departmentToName = departments.find(dep => dep.id === item.departmentIdTo)?.name || '';
            const transferStatus = item.status || '';
            const transfersLocationFrom = item.locationFrom || '';
            const transfersLocationTo = item.locationTo || '';

            const searchTextLower = searchText.toLowerCase();

            return (
                employeeName.toLowerCase().includes(searchTextLower) ||
                approverName.toLowerCase().includes(searchTextLower) ||
                departmentFromName.toLowerCase().includes(searchTextLower) ||
                departmentToName.toLowerCase().includes(searchTextLower) ||
                transferStatus.toLowerCase().includes(searchTextLower) ||
                transfersLocationFrom.toLowerCase().includes(searchTextLower) ||
                transfersLocationTo.toLowerCase().includes(searchTextLower)
            );
        });
        setFilteredTransfersRequest(filteredData);
    }, [searchText, transfersRequest, employees, departments]);

    const handleTableChange = (page: number, pageSize: number) => {
        setPageSize(pageSize || 10); // Cập nhật state khi người dùng thay đổi số lượng mục trên mỗi trang
    };

    const handleAddTransfersRequest = async (newTransfersRequest: TransfersRequest) => {
        setTransfersRequest(prev => [...prev, newTransfersRequest]);
        setFilteredTransfersRequest(prev => [...prev, newTransfersRequest]);
        setIsAdding(false);
    }

    return (
        <div>
            <div style={{ padding: 10 }}>
                <h1>Danh sách yêu cầu điều chuyển nhân sự</h1>
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
                        <Button type="primary" style={{ marginRight: 20 }} onClick={() => setIsAdding(true)}>
                            Tạo đơn yêu cầu
                        </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredTransfersRequest}
                    rowKey={(record) => record.id.toString()}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: pageSize, // Áp dụng số lượng mục hiển thị trên mỗi trang
                        showSizeChanger: true, // Hiển thị tùy chọn thay đổi số lượng mục hiển thị trên mỗi trang
                        pageSizeOptions: ['5', '10', '20', '50'], // Các tùy chọn cho số lượng mục trên mỗi trang
                        onChange: handleTableChange, // Gọi hàm khi số lượng mục thay đổi
                    }}
                    scroll={{ x: 1700, y: 600 }}
                >
                    <Column
                        title="ID"
                        dataIndex="id"
                        key="id"
                        fixed='left'
                        width={50}
                    />
                    <Column
                        title="Người tạo"
                        dataIndex="createdByEmployeeId"
                        key="createdByEmployeeId"
                        fixed='left'
                        render={(createdByEmployeeId: number) => {
                            const employee = employees.find(emp => emp.id === createdByEmployeeId);
                            return employee ? employee.name : 'Unknown';
                        }}
                    />
                    <Column
                        title="Người đang phê duyệt"
                        dataIndex="approverId"
                        key="approverId"
                        render={(approverId: number) => {
                            const employee = employees.find(emp => emp.id === approverId);
                            return employee ? employee.name : 'Unknown';
                        }}
                    />
                    <Column
                        title="Phòng ban từ"
                        dataIndex="departmentIdFrom"
                        key="departmentIdFrom"
                        render={(departmentIdFrom: number) => {
                            const department = departments.find(dep => dep.id === departmentIdFrom);
                            return department ? department.name : 'Unknown';
                        }}
                    />
                    <Column
                        title="Phòng ban đến"
                        dataIndex="departmentIdTo"
                        key="departmentIdTo"
                        render={(departmentIdTo: number) => {
                            const department = departments.find(dep => dep.id === departmentIdTo);
                            return department ? department.name : 'Unknown';
                        }}
                    />
                    <Column title="Chức vụ từ" dataIndex="positionFrom" key="positionFrom" />
                    <Column title="Chức vụ đến" dataIndex="positionTo" key="positionTo" />
                    <Column title="Địa điểm từ" dataIndex="locationFrom" key="locationFrom" />
                    <Column title="Địa điểm đến" dataIndex="locationTo" key="locationTo" />
                    <Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => getStatusTag(status)}
                    />
                    <Column
                        title="Ngày tạo"
                        dataIndex="createdAt"
                        key="createdAt"
                        render={(text: Date) => dayjs(text).format('DD/MM/YYYY')}
                    />
                    <Column
                        title="Ngày cập nhật"
                        dataIndex="updatedAt"
                        key="updatedAt"
                        render={(text: Date | null | undefined) => text ? dayjs(text).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                    />
                    <Column
                        title="Hành động"
                        key="operation"
                        fixed="right"
                        width={210}
                        render={(text, record: TransfersRequest) => (
                            <Space size="middle">
                                <Link to={`/transfers/detail/${record.id}`}>
                                    <Button type="primary">
                                        Chi tiết
                                    </Button>
                                </Link>
                                {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(record.status) ? (
                                    <Button type="primary" disabled>
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <Button type="primary">
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </div>

            <Modal
                title={"Thêm mới nhân viên"}
                visible={isAdding}
                footer={null}
                onCancel={() => setIsAdding(false)}
            >
                <AddTransfersRequestForm
                    onUpdate={handleAddTransfersRequest}
                    onCancel={() => setIsAdding(false)}
                />
            </Modal>
        </div>
    );
};

export default ListTransfersEmployees;