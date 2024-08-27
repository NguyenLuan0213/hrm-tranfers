import { Table, Space, Button, Input, Row, Col, Tag, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { TransfersRequest } from "../data/TransfersRequest";
import { getmockTransfersRequest } from "../services/TransfersRequestServices";
import { Employee } from "../../nhan-vien/data/EmployeesData";
import { getEmployees } from "../../nhan-vien/services/EmployeeServices";
import { Departments } from "../../phong-ban/data/DepartmentData";
import { getDepartment } from "../../phong-ban/services/DepartmentServices";
import { useNavigate } from "react-router-dom";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import AddTransfersRequestForm from "./AddTransferRequestForm";
import UpdateTransfersRequestForm from "../components/UpdateTransfersRequestForm";
import { UseUpdateTransfersRequest } from "../hooks/UseUpdateTransfersRequest";
import { useUserRole } from "../../../hooks/UserRoleContext";

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
    const [pageSize, setPageSize] = useState<number>(10); // State để lưu số lượng mục hiển thị trên mỗi trang
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<TransfersRequest | null>(null);
    const navigate = useNavigate();

    const { selectedRole, selectedDepartment, selectedId, selectedDepartmentId } = useUserRole();
    const { handleUpdate, loading: updating, error } = UseUpdateTransfersRequest();

    useEffect(() => {
        const fetchData = async () => {
            const transferData = await getmockTransfersRequest();
            const uniqueTransfers = transferData.filter((value, index, self) =>
                index === self.findIndex((t) => t.id === value.id)
            );
            setTransfersRequest(uniqueTransfers);
            setFilteredTransfersRequest(uniqueTransfers);
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

    const handleUpdateTransfersRequest = async (updatedTransfersRequest: TransfersRequest) => {
        console.log('handleUpdateTransfersRequest called with:', updatedTransfersRequest);
        const success = await handleUpdate(updatedTransfersRequest.id, updatedTransfersRequest);
        if (success) {
            setIsUpdating(false);
            console.log('Cập nhật thành công:', updatedTransfersRequest);
            const updatedTransfers = transfersRequest.map(tr => tr.id === updatedTransfersRequest.id ? updatedTransfersRequest : tr);
            setTransfersRequest(updatedTransfers);
            setFilteredTransfersRequest(updatedTransfers);
        }
    }

    const canAdd = () => {
        if (selectedRole === 'Nhân viên' && (selectedDepartment === 'Phòng kế toán' || selectedDepartment === 'Phòng kỹ thuật')) {
            return true;
        }
        return false;
    }

    const canEdit = () => {
        if (selectedRole === 'Nhân viên' && (selectedDepartment === 'Phòng kế toán' || selectedDepartment === 'Phòng kỹ thuật')) {
            return true;
        }
        return false;
    }

    const canViewDetail = (record: TransfersRequest) => {
        if (selectedRole === 'Nhân viên' && selectedDepartment === 'Phòng nhân sự' ||
            selectedRole === 'Quản lý' && selectedDepartment === 'Phòng nhân sự' ||
            selectedRole === 'Quản lý' && selectedDepartmentId === record.departmentIdFrom ||
            selectedId === record.createdByEmployeeId) {
            return true;
        }
        return false;
    }

    const handleViewDetail = (record: TransfersRequest) => {
        navigate(`detail/${record.id}`);
    };

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
                        {canAdd() ? (
                            <Button type="primary" style={{ marginRight: 20 }} onClick={() => setIsAdding(true)}>
                                Tạo đơn yêu cầu
                            </Button>
                        ) : (
                            <Button disabled type="primary" style={{ marginRight: 20 }} onClick={() => setIsAdding(true)}>
                                Tạo đơn yêu cầu
                            </Button>
                        )}
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
                        onChange: handleTableChange,
                    }}
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
                            return employee ? employee.name : 'Chưa phê duyệt';
                        }}
                    />
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
                        render={(text, record: TransfersRequest) => (
                            <Space size="middle">
                                {canViewDetail(record) ? (
                                    <Button type="primary" onClick={() => handleViewDetail(record)}>
                                        Chi tiết
                                    </Button>
                                ) : (
                                    <Button type="primary" disabled>
                                        Chi tiết
                                    </Button>
                                )}
                                {canEdit() && !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(record.status)
                                    && selectedId == record.createdByEmployeeId ? (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setSelectedTransfer(record);
                                            setIsUpdating(true);
                                        }}>
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <Button type="primary" disabled>
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </div>

            <Modal
                title={"Thêm mới yêu cầu điều chuyển nhân sự"}
                open={isAdding}
                footer={null}
                onCancel={() => setIsAdding(false)}
            >
                <AddTransfersRequestForm
                    onUpdate={handleAddTransfersRequest}
                    onCancel={() => setIsAdding(false)}
                />
            </Modal>

            <Modal
                title={"Chỉnh sửa"}
                open={isUpdating}
                footer={null}
                onCancel={() => setIsUpdating(false)}
            >
                <UpdateTransfersRequestForm
                    transfersRequest={selectedTransfer}
                    onUpdate={handleUpdateTransfersRequest}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>
        </div>
    );
};

export default ListTransfersEmployees;