import { Button, Col, Flex, Input, message, Row, Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import React, { useEffect, useState } from "react";
import { getTransfersDecisions } from "../services/TransfersDecisionsService";
import { TransferDecision } from "../data/TransfersDecision";
import { getNameEmployee } from "../../../../nhan-vien/services/EmployeeServices";
import { useUserRole } from "../../../../../hooks/UserRoleContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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

const ListTransfersDecisions: React.FC = () => {
    const [transfersDecisions, setTransfersDecisions] = useState<TransferDecision[]>([]);
    const [filteredTransfersRequest, setFilteredTransfersRequest] = useState<TransferDecision[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [employee, setEmployee] = useState<{ id: number; name: string; }[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const { selectedRole, selectedDepartment } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedDepartment === 'Phòng nhân sự' || selectedDepartment === "Phòng giám đốc") {
                const data = await getTransfersDecisions();
                setTransfersDecisions(data);
                const employeeData = await getNameEmployee();
                setEmployee(employeeData);
            } else {
                message.error("Bạn không có quyền truy cập vào trang này");
                navigate('/transfers');
            }
        };
        console.log(transfersDecisions);
        fetchData();
    }, [selectedDepartment]);

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
        setFilteredTransfersRequest(filteredData);
    }, [searchText, employee, transfersDecisions]);

    const handleTableChange = (page: number, pageSize: number) => {
        setPageSize(pageSize || 10); // Cập nhật state khi người dùng thay đổi số lượng mục trên mỗi trang
    };


    return (
        <div>
            <div style={{ padding: 10 }}>
                <h1>Danh sách đơn quyết định điều chuyển nhân sự</h1>
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
                        {/* {canAdd() ? (
                            <Button type="primary" style={{ marginRight: 20 }} onClick={() => setIsAdding(true)}>
                                Tạo đơn yêu cầu
                            </Button>
                        ) : ( */}
                        <Button type="primary" style={{ marginRight: 20 }} >
                            Tạo đơn duyệt yêu cầu
                        </Button>
                        {/* )} */}
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
                        render={(text: string) => getStatusTag(text)}
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
                                {/* {canViewDetail(record) ? (
                                <Button type="primary" onClick={() => handleViewDetail(record)}>
                                    Chi tiết
                                </Button>
                            ) : ( */}
                                <Button type="primary">
                                    Chi tiết
                                </Button>
                                {/* )} */}
                                {/* {canEdit() && !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(record.status)
                                && selectedId == record.createdByEmployeeId ? (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setSelectedTransfer(record);
                                        setIsUpdating(true);
                                    }}>
                                    Chỉnh sửa
                                </Button>
                            ) : ( */}
                                <Button type="primary">
                                    Chỉnh sửa
                                </Button>
                                {/* )} */}
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};

export default ListTransfersDecisions;