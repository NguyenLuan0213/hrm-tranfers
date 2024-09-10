import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Space, Button, Input, Row, Col, Tag, Modal, Typography } from "antd";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
//Import dữ liệu
import { TransfersRequest, TransferRequestStatus } from "../data/transfer_request";
import { Employee } from "../../nhan-vien/data/employees_data";
//Import services
import { getmockTransfersRequest } from "../services/transfers_request_services";
import { getEmployees } from "../../nhan-vien/services/employee_services";
import { Departments } from "../../phong-ban/data/department_data";
import { getDepartment } from "../../phong-ban/services/department_services";
//Import hooks
import { useUpdateTransfersRequest } from "../hooks/use_update_transfer_request";
import { useUserRole } from "../../../hooks/UserRoleContext";
//Import components
import AddTransfersRequestForm from "./AddTransferRequestForm";
import UpdateTransfersRequestForm from "./UpdateTransfersRequestForm";
import { getStatusTag } from "./GetTagStatusTransferRequest";

const { Search } = Input;
const { Title } = Typography;

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

    const { selectedRole, selectedDepartment, selectedId, selectedDepartmentId } = useUserRole();// Lấy thông tin người dùng hiện tại
    const { handleUpdate, loading: updating, error } = useUpdateTransfersRequest();

    // Lấy dữ liệu yêu cầu điều chuyển nhân sự
    useEffect(() => {
        const fetchData = async () => {
            const transferData = await getmockTransfersRequest();
            // Lọc ra các yêu cầu duy nhất
            const uniqueTransfers = transferData.filter((value, index, self) =>
                index === self.findIndex((t) => t.id === value.id)
            );
            setTransfersRequest(uniqueTransfers);
            setFilteredTransfersRequest(uniqueTransfers);
        };
        fetchData();
    }, []);

    //lấy dữ liệu nhân viên và phòng ban
    useEffect(() => {
        const fetchData = async () => {
            const employeeData = await getEmployees();
            const departmentData = await getDepartment();
            setEmployees(employeeData);
            setDepartments(departmentData);
        };
        fetchData();
    }, []);

    // Lọc dữ liệu yêu cầu theo từ khóa tìm kiếm
    useEffect(() => {
        const filteredData = transfersRequest.filter(item => {
            const employeeName = employees.find(emp => emp.id === item.createdByEmployeeId)?.name || '';
            const approverName = employees.find(emp => emp.id === item.approverId)?.name || '';
            const departmentFromName = departments.find(dep => dep.id === item.departmentIdFrom)?.name || '';
            const departmentToName = departments.find(dep => dep.id === item.departmentIdTo)?.name || '';
            const transferStatus = item.status || '';
            const transfersLocationFrom = item.locationFrom || '';
            const transfersLocationTo = item.locationTo || '';

            // Chuyển tất cả dữ liệu sang chữ thường để tìm kiếm
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

    // Thêm yêu cầu điều chuyển nhân sự
    const handleAddTransfersRequest = async (newTransfersRequest: TransfersRequest) => {
        setTransfersRequest(prev => [...prev, newTransfersRequest]);
        setFilteredTransfersRequest(prev => [...prev, newTransfersRequest]);
        setIsAdding(false);
    }

    // Cập nhật yêu cầu điều chuyển nhân sự
    const handleUpdateTransfersRequest = async (updatedTransfersRequest: TransfersRequest) => {
        const success = await handleUpdate(updatedTransfersRequest.id, updatedTransfersRequest);
        if (success) {
            setIsUpdating(false);
            const updatedTransfers = transfersRequest.map(tr => tr.id === updatedTransfersRequest.id ? updatedTransfersRequest : tr);
            setTransfersRequest(updatedTransfers);
            setFilteredTransfersRequest(updatedTransfers);
        }
    }

    // Kiểm tra quyền của người dùng khi thêm yêu cầu
    const canAdd = () => {
        if (selectedRole === 'Nhân viên' && (selectedDepartment === 'Phòng kế toán' || selectedDepartment === 'Phòng kỹ thuật')) {
            return true;
        }
        return false;
    }

    // Kiểm tra quyền của người dùng khi chỉnh sửa yêu cầu
    const canEdit = () => {
        if (selectedRole === 'Nhân viên' && (selectedDepartment === 'Phòng kế toán' || selectedDepartment === 'Phòng kỹ thuật')) {
            return true;
        }
        return false;
    }

    // Kiểm tra quyền của người dùng khi xem chi tiết yêu cầu
    const canViewDetail = (record: TransfersRequest) => {
        if (selectedRole === 'Nhân viên' && selectedDepartment === 'Phòng nhân sự' ||
            selectedRole === 'Quản lý' && selectedDepartment === 'Phòng nhân sự' ||
            selectedRole === 'Quản lý' && selectedDepartmentId === record.departmentIdFrom ||
            selectedId === record.createdByEmployeeId) {
            return true;
        }
        return false;
    }

    //Chuyển đến trang chi tiết yêu cầu
    const handleViewDetail = (record: TransfersRequest) => {
        navigate(`detail/${record.id}`);
    };

    return (
        <div>
            <div style={{ padding: 10 }}>
                <Title level={2}>Danh sách đơn yêu cầu điều chuyển nhân sự</Title>
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
                        render={(status: string) => getStatusTag(status as TransferRequestStatus)}
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