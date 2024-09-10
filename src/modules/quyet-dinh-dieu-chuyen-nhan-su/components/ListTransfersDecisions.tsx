import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Typography, Input, message, Modal, Row, Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
//import dữ liệu
import { TransferDecision, TransferDecisionStatus } from "../data/transfer_decision";
//import service
import { getTransfersDecisions } from "../services/transfer_decision_service";
import { getNameEmployee } from "../../nhan-vien/services/employee_services";
//import hooks
import { useUserRole } from "../../../hooks/UserRoleContext";
//import components
import AddTransfersDecisionsForm from "./AddTransfersDecisionForm"
import UpdateTransferDecisionForm from "./UpdateTransferDecisionForm";
import { getStatusTag } from "./GetTagStatusTransferDecision"

const { Search } = Input;
const { Title } = Typography;

const ListTransfersDecisions: React.FC = () => {
    const [transfersDecisions, setTransfersDecisions] = useState<TransferDecision[]>([]);
    const [filteredTransfersDecisions, setFilteredTransfersDecisions] = useState<TransferDecision[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [employee, setEmployee] = useState<{ id: number; name: string; }[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedTransfersDecisions, setSelectedTransfersDecisions] = useState<TransferDecision | null>(null);

    const { selectedRole, selectedDepartment, selectedId } = useUserRole();
    const navigate = useNavigate();

    // Hàm lấy dữ liệu ban đầu
    const fetchData = async () => {
        if (selectedDepartment === 'Phòng nhân sự' || selectedDepartment === "Phòng giám đốc") {
            //lấy danh sách quyết định điều chuyển nhân sự
            const data = await getTransfersDecisions();
            const uniqueTransfers = data.filter((value, index, self) =>
                index === self.findIndex((t) => t.id === value.id)
            );
            setTransfersDecisions(uniqueTransfers);
            setFilteredTransfersDecisions(uniqueTransfers);  //lưu để tìm kiếm
            //lấy danh sách nhân viên
            const employeeData = await getNameEmployee();
            setEmployee(employeeData);
        } else {
            message.error("Bạn không có quyền truy cập vào trang này");
            navigate('/transfers');
        }
    };

    //Gọi hàm lấy dữ liệu ban đầu
    useEffect(() => {
        fetchData();
    }, [selectedDepartment,]);

    //Set filter cho bảng
    useEffect(() => {
        const filteredData = transfersDecisions.filter(item => {
            const employeeName = employee.find(emp => emp.id === item.createdByEmployeeId)?.name || '';
            const approverName = employee.find(emp => emp.id === item.approverId)?.name || '';
            const transferStatus = item.status || '';
            const transfersRequestId = (item.requestId || '').toString(); // Convert to string

            const searchTextLower = searchText.toLowerCase();
            return (
                employeeName.toLowerCase().includes(searchTextLower) ||
                approverName.toLowerCase().includes(searchTextLower) ||
                transferStatus.toLowerCase().includes(searchTextLower) ||
                transfersRequestId.toLowerCase().includes(searchTextLower)
            );
        });
        setFilteredTransfersDecisions(filteredData);
    }, [searchText, employee, transfersDecisions]);

    //Hàm thay đổi trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPageSize(pageSize || 10); // Cập nhật state khi người dùng thay đổi số lượng mục trên mỗi trang
    };

    //Hàm thêm quyết định điều chuyển
    const handleAddTransfersRequest = async (newTransfersDecision: TransferDecision) => {
        setIsAdding(false);
        fetchData();    //Lấy dữ liệu mới sau khi thêm
    };

    //Phân quyền thêm quyết định điều chuyển
    const canAdd = () => {
        return (selectedDepartment === 'Phòng nhân sự')
    }

    //hàm chuyển trang chi tiết
    const handleViewDetail = (record: TransferDecision) => {
        navigate(`/transfers/decisions/detail/${record.id}`);
    }

    //Hàm chỉnh sửa quyết định điều chuyển
    const handleUpdateTransfersDecision = (updatedTransferDecision: TransferDecision) => {
        setIsUpdating(false);
        fetchData();
        message.success('Cập nhật quyết định điều chuyển thành công');
    };

    return (
        <div>
            <div style={{ padding: 10 }}>
                <Title level={2}>Danh sách đơn quyết định điều chuyển nhân sự</Title>
                <Row>
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
                                Tạo đơn quyết định
                            </Button>
                        ) : (
                            <Button type="primary" style={{ marginRight: 20 }} disabled>
                                Tạo đơn quyết định
                            </Button>
                        )}
                    </Col>
                </Row>
                <Table
                    dataSource={filteredTransfersDecisions}
                    rowKey={(record) => (record.id ? record.id.toString() : 'undefined_id')}
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
                        title="Mã đơn yêu cầu"
                        dataIndex="requestId"
                        key="requestId"
                    />
                    <Column
                        title="Người tạo"
                        dataIndex="createdByEmployeeId"
                        key="createdByEmployeeId"
                        render={(text: number) => {
                            return employee.find((emp) => emp.id === text)?.name || 'Chưa cập nhật';
                        }}
                    />
                    <Column
                        title="Người đang phê duyệt"
                        dataIndex="approverId"
                        key="approverId"
                        render={(text: number) => {
                            return employee.find((emp) => emp.id === text)?.name || 'Chưa cập nhật';
                        }}
                    />
                    <Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(text: string) => getStatusTag(text as TransferDecisionStatus)}
                    />
                    <Column
                        title="Ngày tạo"
                        dataIndex="createdAt"
                        key="createdAt"
                        render={(text: Date | null | undefined) => text ? dayjs(text).format('DD/MM/YYYY') : 'Chưa cập nhật'}
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
                        render={(text, record: TransferDecision) => (
                            <Space size="middle">
                                <Button type="primary" onClick={() => handleViewDetail(record)}>
                                    Chi tiết
                                </Button>
                                {!['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(record.status)
                                    && selectedId == record.createdByEmployeeId ? (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setSelectedTransfersDecisions(record);
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
                title={"Thêm đơn quyết định điều chuyển nhân sự"}
                open={isAdding}
                footer={null}
                onCancel={() => setIsAdding(false)}
            >
                <AddTransfersDecisionsForm
                    onUpdate={handleAddTransfersRequest}
                    onCancel={() => setIsAdding(false)}
                />
            </Modal>

            <Modal
                title="Chỉnh sửa quyết định điều chuyển"
                open={isUpdating}
                onCancel={() => setIsUpdating(false)}
                footer={null}
            >
                <UpdateTransferDecisionForm
                    transferDecision={selectedTransfersDecisions}
                    onUpdate={handleUpdateTransfersDecision}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>
        </div>
    );
};

export default ListTransfersDecisions;