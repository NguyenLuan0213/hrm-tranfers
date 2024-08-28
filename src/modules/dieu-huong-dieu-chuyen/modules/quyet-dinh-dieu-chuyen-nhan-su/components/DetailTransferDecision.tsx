import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { Card, Col, message, Popover, Row, Tag, Transfer, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTransferDecisionById } from "../services/TransfersDecisionsService"
import { useUserRole } from "../../../../../hooks/UserRoleContext";
import { TransferDecision } from "../data/TransfersDecision"
import { getNameEmployee } from "../../../../nhan-vien/services/EmployeeServices";
import dayjs from "dayjs";

const { Text } = Typography;

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

const DetailTransferDecision: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { selectedId, selectedDepartment, selectedRole } = useUserRole();

    const [transfersDecision, setTransfersDecisionData] = useState<TransferDecision | null>(null);
    const [createdByEmployeeId, setCreatedByEmployeeId] = useState<number | null>(null);
    const [employee, setEmployee] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                // Lấy dữ liệu đơn điều chuyển
                const data = await getTransferDecisionById(parseInt(id));
                setTransfersDecisionData(data);
                setCreatedByEmployeeId(data.createdByEmployeeId || null);
                console.log(data.createdByEmployeeId);

                // Lấy dữ liệu nhân viên
                const employeeData = await getNameEmployee();
                setEmployee(employeeData);
            } else {
                setTransfersDecisionData(null);
            }
        };
        fetchData();
    }, [id]);


    useEffect(() => {
        if (createdByEmployeeId !== null) {
            if (selectedDepartment !== "Phòng giám đốc" && selectedId !== createdByEmployeeId &&
                selectedRole !== "Quản lý" || selectedDepartment !== "Phòng nhân sự") {
                console.log(selectedDepartment);
                console.log("Selected ID:", selectedId, "Created by ID:", createdByEmployeeId);
                navigate('/transfers/decisions');
                message.error('Bạn không có quyền xem đơn này');
            }
        }
    }, [selectedId, createdByEmployeeId, selectedDepartment]);

    return (
        <div style={{ padding: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        title="Chi tiết đơn quyết định điều chuyển"
                        bordered={false}
                        actions={[
                            <Popover
                                placement="topLeft"
                                title="Quay lại danh sách"
                                overlayStyle={{ width: 150 }}
                            >
                                <ArrowLeftOutlined
                                    key="return"
                                />
                            </Popover>,
                            <EditOutlined
                                key="edit"
                            />,
                            <DeleteOutlined
                                key="delete"
                            />,
                            <SendOutlined key="send"
                            />,
                        ]}
                    >
                        <Text strong>ID:</Text> <Text>{transfersDecision?.id}</Text>
                        <br />
                        <Text strong>Trạng thái:</Text> {getStatusTag(transfersDecision?.status || '')}
                        <br />
                        <Text strong>Người tạo đơn:</Text> <Text>{employee.find((emp) => emp.id === createdByEmployeeId)?.name || 'Chưa cập nhật'}</Text>
                        <br />
                        <Text strong>Người đang duyệt:</Text> <Text>{employee.find((emp) => emp.id === transfersDecision?.approverId)?.name || 'Chưa cập nhật'}</Text>
                        <br />
                        <Text strong>Ngày tạo:</Text> <Text>{transfersDecision?.createdAt ? dayjs(transfersDecision.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                        <Text strong>Ngày duyệt đơn:</Text> <Text>{transfersDecision?.updatedAt ? dayjs(transfersDecision.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                        <Text strong>Ngày thực hiện:</Text> <Text>{transfersDecision?.effectiveDate ? dayjs(transfersDecision.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DetailTransferDecision;
